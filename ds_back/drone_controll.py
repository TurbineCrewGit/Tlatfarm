
import collections
import collections.abc
import os
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
# local_waypoints_path = r'C:\Users\Workstation\Desktop'
local_waypoints_path = r'C:\Users\admin\MK96\waypoints.txt'

processed_coordinates = []

connection_string = 'COM3'
baud_rate = 57600

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

            directory = os.path.dirname(local_waypoints_path)  # 경로에서 디렉터리 추출

            if directory and not os.path.exists(directory):
                os.makedirs(directory, exist_ok=True)  # 디렉터리 생성

            try:
                with open(local_waypoints_path, 'w', encoding='utf-8', errors='replace') as file:
                    file.write("QGC WPL 110\n")
            except (OSError, IOError) as e:
                print(f"파일을 저장하는 중 오류 발생: {e}")

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
            print("끼에에에엑")
            vehicle = connect(connection_string, baud=baud_rate, wait_ready=False)
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

    # 🛠 드론 Armed
@app.route('/arm', methods=['POST'])
def armed():
    # 실제 사용 가능한 COM 포트로 변경 (예: 'COM3')
    
    try:
        connection = mavutil.mavlink_connection(connection_string, baud=baud_rate)
    except PermissionError as e:
        print(f"❌ 포트 오류: {e}")
        print("⚠️ COM3 포트가 다른 프로그램에서 사용 중일 수 있습니다. Mission Planner를 종료하고 다시 시도하세요.")
        connection.close() # 💡 연결 실패 시 포트 닫기
        return  jsonify({'state' : 'Fail', 'message' : '포트 오류'}), 200
    print("드론과 연결 대기 중...")

    # 타임아웃 설정 (2초)
    start_time = time.time()
    while True:
        if time.time() - start_time > 2:  # 2초 초과 시 break
            print("❌ 연결 실패: HEARTBEAT 수신 안됨")
            connection.close() # 💡 연결 실패 시 포트 닫기
            return  jsonify({'state' : 'Fail', 'message' : '연결 오류'}), 200

        msg = connection.recv_match(type='HEARTBEAT', blocking=False)
        if msg:
            print("✅ 드론과 연결됨!")
            break

    # 드론 무장 요청 (Arming)
    print("🔹 드론을 무장하는 중...")
    connection.arducopter_arm()

    # 무장(ARM) 상태 확인
    while True:
        msg = connection.recv_match(type='HEARTBEAT', blocking=True)
        armed = msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED
        if armed:
            print("✅ 드론이 ARMED 상태입니다! 🚀")
            break
        else:
            print("❌ 무장 대기 중...")
            
    connection.close()  # ✅ 포트 닫기
    print("🔻 연결 종료")
    return  jsonify({'state' : 'success', 'message' : 'ARM 상태'}), 200
    
# 🛠 드론 Disarmed
@app.route('/disarm', methods=['POST'])
def disarmed():
    """ 드론을 무장 해제(DISARM)하는 함수 """
    try:
        connection = mavutil.mavlink_connection(connection_string, baud=baud_rate)
    except PermissionError as e:
        print(f"❌ 포트 오류: {e}")
        print("⚠️ COM3 포트가 다른 프로그램에서 사용 중일 수 있습니다. Mission Planner를 종료하고 다시 시도하세요.")
        connection.close() # 💡 연결 실패 시 포트 닫기
        return  jsonify({'state' : 'Fail', 'message' : '포트 오류'}), 200
    
    print("🔹 드론을 무장 해제하는 중...")
    connection.arducopter_disarm()

    # 무장 해제 상태 확인
    while True:
        msg = connection.recv_match(type='HEARTBEAT', blocking=True)
        armed = msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED
        if not armed:
            print("✅ 드론이 DISARMED 상태입니다! 🛑")
            break
        else:
            print("❌ 무장 해제 오류...")
    connection.close()  # ✅ 포트 닫기
    print("🔻 연결 종료")

# Flask 서버 실행-
if __name__ == "__main__":
    app.run(port=5000)