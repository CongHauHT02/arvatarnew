import hashlib
import sys
import subprocess

def create_user(username, password, gender=0):
    username = username.strip().lower()
    password = password.strip()
    pwd_hash = hashlib.md5(password.encode('utf-8')).hexdigest()
    email = f"{username}@gmail.com"

    sql = f"""
    USE avatar_2x;
    DELETE FROM users WHERE username = '{username}';
    INSERT INTO users (username, password, role, active, phone, gmail, vnd, tongnap, login_lock) 
    VALUES ('{username}', '{pwd_hash}', 0, 1, '0988888888', '{email}', 0, 0, 0);
    SET @uid = LAST_INSERT_ID();
    DELETE FROM players WHERE user_id = @uid;
    INSERT INTO players (user_id, level_main, gender, scores, xu, luong) 
    VALUES (@uid, 1, {gender}, 0, 10000000, 100000);
    """
    cmd = ['C:\\Program Files\\MariaDB 13.0\\bin\\mariadb.exe', '-u', 'root', '-e', sql]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"=======================================================")
        print(f"TAO TAI KHOAN THANH CONG!")
        print(f"   Tai khoan : {username}")
        print(f"   Mat khau  : {password}")
        print(f"   Xu tang   : 10,000,000 Xu")
        print(f"   Luong tang: 100,000 Luong")
        print(f"=======================================================")
        print(f"Ban co the vao game va dang nhap bang tai khoan nay ngay!")
    else:
        print(f"Loi khi tao tai khoan: {res.stderr}")

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        u = sys.argv[1]
        p = sys.argv[2]
        g = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        create_user(u, p, g)
    else:
        print("--- TAO TAI KHOAN AVATAR 2D ---")
        u = input("Nhap ten tai khoan: ")
        p = input("Nhap mat khau: ")
        create_user(u, p, 0)
