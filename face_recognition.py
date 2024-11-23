import sys
import cv2
import numpy as np
import mysql.connector

def recognize_face(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Không thể đọc ảnh từ {image_path}")
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        face = gray[y:y+h, x:x+w]

        try:
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="Dinh2202",
                database="PRMS"
            )
            cursor = conn.cursor()
            cursor.execute("SELECT patient_id, avatar FROM patients")
            patients = cursor.fetchall()

            for patient_id, avatar_path in patients:
                try:
                    patient_face = cv2.imread(avatar_path, cv2.IMREAD_GRAYSCALE)
                    if patient_face is not None:
                        patient_face = cv2.resize(patient_face, (face.shape[1], face.shape[0]))
                        similarity = cv2.compareHist(
                            cv2.calcHist([face], [0], None, [256], [0, 256]),
                            cv2.calcHist([patient_face], [0], None, [256], [0, 256]),
                            cv2.HISTCMP_CORREL
                        )
                        if similarity > 0.5:
                            return patient_id
                except Exception as e:
                    print(f"Lỗi khi xử lý avatar cho patient {patient_id}: {str(e)}")
        except mysql.connector.Error as err:
            print(f"Lỗi kết nối database: {err}")
        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()

    print("Khong tim thay")
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        result = recognize_face(image_path)
        if result is not None:
            print(result)
    else:
        print("Vui long cung cup duong dan anh")
