import requests
import urllib.request
from bs4 import BeautifulSoup
from pandas import DataFrame
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# 브라우저 꺼짐 방지
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

service = Service(executable_path=ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

header = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; ko-KR))',
}

url = "http://megaitacademy.com/lecture_list/F"

response = requests.get(url, headers=header)
html = response.text
soup = BeautifulSoup(html, 'html.parser')

driver.get(url)
driver.implicitly_wait(10)

linkdiv = driver.find_elements(By.CSS_SELECTOR,"div.it_regular_bottom > a")

array=[]
for linkdivs in linkdiv:
    two_url = linkdivs.get_attribute('href')

    response = requests.get(two_url, headers={'User-agent':'Mozila/5.0'}) 
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    title = soup.title.string

    name = soup.select_one("div.rg_detail_main > p")
    data1 = name.string

    name2 = soup.select_one("div.rg_detail_main > h3")
    if name2.find('span') :
        name2.find('span').decompose()
        data2 = name2.string
    else:
        data2 = name2.string

    name3 = soup.select_one("div.rg_detail_main > h3 + h3")
    if name3.find('span') :
        name3.find('span').decompose()
        data3 = name3.string
    else:
        data3 = name3.string

    name4 = soup.select_one("div.rg_detail_point > h3")
    if name4.find('span') :
        name4.find('span').decompose()
        data4 = name4.string
    else:
        data4 = name4.string

    array.append((title, data1, data2, data3, data4, url))

titlearray = ['사이트명', '강의명', '수강기간', '수강일자', '설명', '사이트주소']

myframe = DataFrame(array, columns=titlearray)

filename = 'crawlingData.csv'
myframe.to_csv(filename, encoding='utf8', index=False)
print(filename, '으로 저장되었습니다.', sep='')