
import collections
import collections.abc
collections.MutableMapping = collections.abc.MutableMapping

from collections.abc import MutableMapping

from flask import Flask, request, render_template_string, jsonify
from flask_cors import CORS
from pyngrok import ngrok
import json
from dronekit import connect, Command
from pymavlink import mavutil
import time

# Flask 앱 생성
app = Flask(__name__)
CORS(app)  # 모든 도메인 허용

# 로컬에 저장할 웨이포인트 파일 경로
local_waypoints_path = r'C:\Users\Workstation\Desktop'

processed_coordinates = []

def command_to_dict(command):
    # 필요한 속성을 딕셔너리로 변환
    return {
        'seq': command.seq,
        'frame': command.frame,
        'command': command.command,
        'current': command.current,
        'autocontinue': command.autocontinue,
        'param1': command.param1,
        'param2': command.param2,
        'param3': command.param3,
        'param4': command.param4,
        'x': command.x,
        'y': command.y,
        'z': command.z
    }


@app.route("/", methods=["GET", "POST"])
def hello():
    if request.method == "POST":
        # 좌표 데이터를 요청에서 가져옴
        try:
            data = request.get_json()

            print(data)

            # 좌표 데이터를 리스트로 추출 (리스트가 아닐 경우 빈 리스트로 초기화)
            coordinates_list = data.get('coordinates', [])
            with open(local_waypoints_path, 'w', encoding='utf-8') as file:
                file.write("QGC WPL 110\n")

            # 받은 좌표가 리스트인지 확인
            if not isinstance(coordinates_list, list):
                raise ValueError('coordinates는 리스트여야 합니다.')

            # 좌표 리스트의 각 항목에서 위도와 경도를 추출 및 출력
            index = 0
            processed_coordinates.clear()  # 기존 데이터를 초기화하여 새로운 데이터로 덮어씌움

            port = data.get('port')
            print(f"뽀뜨 = {port}")

            
            for coordinates in coordinates_list:
                if index == 0:
                    a = 1
                else:
                    a = 0

                if index == 0:
                    b = 3
                else:
                    b = 3

                latitude = coordinates.get('lat')
                print(f"받은 좌표: 위도 = {latitude}")
                
                longitude = coordinates.get('lng')
                print(f"경도 = {longitude}")
                
                altitude = coordinates.get('alt')
                print(f"고도 = {altitude}")
                
                fmode = coordinates.get('flightMode')
                print(f"비행모드 = {fmode}")

              

                # 비행 명령 설정
                if fmode == 1:
                    flight = mavutil.mavlink.MAV_CMD_NAV_TAKEOFF
                elif fmode == 2:
                    flight = mavutil.mavlink.MAV_CMD_NAV_WAYPOINT
                elif fmode == 3:
                    flight = mavutil.mavlink.MAV_CMD_NAV_LAND
                else:
                    raise ValueError('유효하지 않은 비행 모드입니다.')

                processed_coordinates.append(Command(index, a, b, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, 
                                                     flight, 0, 0, 0, 0, 0, 0, latitude, longitude, altitude))
                index += 1

            # 드론으로 경로 전송
            print("웨이포인트가 로컬 경로에 저장되었습니다.")
            connection_string = 'COM3'
            baud_rate = 115200
            print("끼에에에엑")
            vehicle = connect(connection_string, baud=baud_rate, wait_ready=True)
            cmds = vehicle.commands
            cmds.clear()
            print("끼에에에엑3")
            for command in processed_coordinates:
                cmds.add(command)
            print("끼에에에엑4")
            cmds.upload()
            print("웨이포인트 업로드 완료.")
            vehicle.commands.wait_ready()
            print("명령 동기화 완료.")
            vehicle.close()

            return jsonify({
                'status': 'success',
                'message': '좌표 데이터가 성공적으로 처리되고 웨이포인트가 업로드되었습니다.',
                'receivedCoordinates': [command_to_dict(cmd) for cmd in processed_coordinates]
            }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 400

    # GET 요청 시 입력 폼 제공
    form_html = '''
        <form method="POST">
            <input type="submit" value="웨이포인트 저장">
        </form>
    '''
    return render_template_string(form_html)


# Flask 서버 실행-
if __name__ == "__main__":
    app.run(port=5000)