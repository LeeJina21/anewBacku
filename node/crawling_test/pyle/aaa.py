import csv
import json
import requests
import urllib.request
from bs4 import BeautifulSoup
from pandas import DataFrame
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument("--single-process")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--remote-debugging-port=9222")

service = Service(executable_path=ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)


header = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; ko-KR))',
}


url = "https://www.ezenac.co.kr/"

response = requests.get(url, headers=header)
html = response.text
soup = BeautifulSoup(html, 'html.parser')

driver.get(url)
driver.implicitly_wait(10)

linkdiv = driver.find_elements(By.CSS_SELECTOR,"ul.student > li > a")

website_list = soup.title.string # 사이트명

array=[]
hrmlResult=[]
for linkdivs in linkdiv:
    two_url = linkdivs.get_attribute('href')

    response = requests.get(two_url, headers={'User-agent':'Mozila/5.0'}) 
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    name = soup.select_one("div.title-wrap > h3.curriculum-title") # 과정명 / 국비인지 사비인지
    course_name = name.text.replace("\t", "").replace("\n", "")

    type_name_m = soup.select_one("ul.student > li > a > span.label") #과정분류
    type_name = type_name_m.text

    course_duration_m = soup.select_one("dl.item1 > dd") # 과정기간
    if course_duration_m.find('span') :
        course_duration_m.find('span').decompose()
        course_duration = course_duration_m.text
    else:
        course_duration = course_duration_m.text.replace("\n", "").replace("\t", "")

    begin_date_m = soup.select_one("div.curriculum-info > dl > dd") # 과정날짜
    if begin_date_m.find('span') :
        begin_date_m.find('span').decompose()
        begin_date = begin_date_m.text
    else:
        begin_date = begin_date_m.text

    description_m = soup.select_one("p.small-text") # 설명
    if description_m.find('span') :
        description_m.find('span').decompose()
        description = description_m.text
    else:
        description = description_m.text

    array.append((website_list, course_name,type_name, course_duration, begin_date, description, two_url))
    hrmlResult.append((name, type_name_m, course_duration_m, begin_date_m, description_m))

titlearray = ['사이트명','과정분류', '과정명', '과정기간', '과정날짜', '설명', '사이트 주소']

myframe = DataFrame(array, columns=titlearray)
myframe2 = DataFrame(hrmlResult)

filename = 'aaa.csv'
filename2 = 'hrmlEss.csv'
myframe.to_csv(filename, encoding='utf8', index=False)
myframe2.to_csv(filename2, encoding='utf8', index=False, header=False)
print(filename, '으로 저장되었습니다.', sep='')

jsonlist = []
with open('aaa.csv', 'rt', encoding='utf8') as csv_file:
    reader = csv.DictReader(csv_file)
    jsonlist = list(reader)

with open('aaa.json', 'w', encoding='utf8') as json_file:
    json.dump(jsonlist, json_file, indent="\t", ensure_ascii=False)