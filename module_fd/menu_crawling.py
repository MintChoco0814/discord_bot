import requests
from bs4 import BeautifulSoup
import json
url = "https://www.doowon.ac.kr/kr/706/subview.do?enc=Zm5jdDF8QEB8JTJGZGlldCUyRmtyJTJGMyUyRnZpZXcuZG8lM0Ztb25kYXklM0QyMDI2LjA1LjI1JTI2d2VlayUzRHByZSUyNg%3D%3D"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# 식단 데이터 저장 
menu_data = []

# 테이블 행(tr) 찾기 
rows = soup.select("table tbody tr")

current_day = ""
used_days = set()
for row in rows:
    # 요일 (th)
    th = row.find("th")

    # 식단 데이터(td)
    cols = row.find_all("td")

    # th가 있으면 새로운 요일 저장
    if th:
        current_day = th.get_text(strip=True)
    if len(cols) < 3:
        continue
    meal_type = "중식"

    # 메뉴 내용 줄바꿈 유지 
    menu_text = cols[2].get_text("\n", strip=True)
    menu = menu_text.split("\n")

    # 중복 요일 없애기
    if current_day in used_days:
        continue
    # 식단 없는 날 제외 
    if "등록된 식단내용" in menu_text:
        continue
    

    menu_data.append({
        "요일": current_day,
        "식단구분": "중식",
        "식단내용": menu
    })

    used_days.add(current_day)


# JSON 파일 저장 
with open("../data_fd/menu.json", "w", encoding="utf-8") as f:
    json.dump(menu_data, f, ensure_ascii=False, indent=4)

print("menu.json 저장 완료")
