import requests
import locale
import logging
from json import JSONDecodeError
import base64

# This code example demonstrates how to convert HTML document to PNG images.
import random

from django.http import HttpResponse
from .images import PER, POCKET, img0, img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12,img13,img14,img15,img16,img17,img18,img19,img20,img21,img22,img23,img24,img25,img26,img27,img28,img29,img30
from .templates.COLOR_DICT import COLOR_DICT
import cairosvg
import pygal
from pygal.style import Style

locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')

logger = logging.getLogger('testlogger')


def svg_to_base64(svg_code):
    png_data = cairosvg.svg2png(bytestring=svg_code)
    # PNG를 base64 문자열로 인코딩
    b64_data = base64.b64encode(png_data).decode('utf-8')
    image_url = f"data:image/png;base64,{b64_data}"
    return image_url

def svg_chart(request):
    custom_style = Style(
        background='transparent',
        plot_background='transparent',
        major_guide_stroke_dasharray='#FFFFFF',
        guide_stroke_dasharray='#FFFFFF',
        foreground_subtle='#FFFFFF',
        foreground_strong='#FFFFFF',
        foreground='#FFFFFF',
        colors=('#989DFA', '#E8537A', '#E95355', '#E87653', '#E89B53', '#E89B53', '#E89B53', '#E89B53'),
        guides=('#FFFFFF'),
        guide_stroke_color = 'white',
        major_guide_stroke_color = 'white',
        opacity = '0.9',
        major_label_font_size = 20,
    )
    radar_chart = pygal.Radar(width=520,height=500,show_major_y_labels=False,show_minor_y_labels=False,y_labels_major_every=2,fill=True,style=custom_style,show_legend=False)
    radar_chart.x_labels = ['', '', '', '', '', '']
    radar_chart.add('Exp', request)
    chartspider = radar_chart.render()

    response = svg_to_base64(chartspider)

    return response

def svg_chart_personal(request, request2):
    custom_style = Style(
        background='transparent',
        plot_background='transparent',
        major_guide_stroke_dasharray='#FFFFFF',
        guide_stroke_dasharray='#FFFFFF',
        foreground_subtle='#FFFFFF',
        foreground_strong='#FFFFFF',
        foreground='#FFFFFF',
        colors=('#FFC1C1', '#E8537A', '#E95355', '#E87653', '#E89B53', '#E89B53', '#E89B53', '#E89B53'),
        guides=('#FFFFFF'),
        guide_stroke_color = 'white',
        major_guide_stroke_color = 'white',
        opacity = '0.9',
        major_label_font_size = 20,
    )
    radar_chart = pygal.Radar(width=520,height=500,show_major_y_labels=False,show_minor_y_labels=False,y_labels_major_every=2,fill=True,style=custom_style,show_legend=False)
    radar_chart.x_labels = ['', '', '', '', '', '']
    radar_chart.add('Exp', request)
    radar_chart.add('My Exp', request2)
    chartspider = radar_chart.render()

    response = svg_to_base64(chartspider)

    return response

def languageCount(data):
    if data != None:
        if len(data) > 7:
            data = data[:6]
        else:
            while len(data) <= 6:
                data.append(('','0','0','0'))
    else:
        data = [('','0','0','0')]*6
    img_enter = 0
    for i in range(len(data)):
        if data[i][0] != '':
            if i == 0 or i == 3:
                img_enter = 0
            else:
                img_enter = int(data[i-1][2]) + int(data[i-1][3]) + 5
            if data[i] in COLOR_DICT:
                data[i] = (data[i], COLOR_DICT[data[i]]['color'], str(img_enter), str(len(data[i])*5+10))
            else:
                color = random.randrange(0,len(RANDOM_COLOR))
                data[i] = (data[i], COLOR_DICT[color]['color'], str(img_enter), str(len(data[i])*5+10))
    print(data)
    return data

# Create your views here.
IMG = {
    'Per' : PER,
    'pocket': POCKET,
    'img0': img0,
    'img1': img1,
    'img2': img2,
    'img3': img3,
    'img4': img4,
    'img5': img5,
    'img6': img6,
    'img7': img7,
    'img8': img8,
    'img9': img9,
    'img10': img10,
    'img11': img11,
    'img12': img12,
    'img13': img13,
    'img14': img14,
    'img15': img15,
    'img16': img16,
    'img17': img17,
    'img18': img18,
    'img19': img19,
    'img20': img20,
    'img21': img21,
    'img22': img22,
    'img23': img23,
    'img24': img24,
    'img25': img25,
    'img26': img26,
    'img27': img27,
    'img28': img28,
    'img29': img29,
    'img30': img30,
}

ELLIPSE_TYPE = {
    0 : 'elli1',
    1 : 'elli1',
    2 : 'elli2',
    3 : 'elli3',
}
print(COLOR_DICT)
# COLOR_DICT = {
# 'JavaScript' : '#F7DF1E',
# 'Java' : '#007396',
# 'Python' : '#3776AB',
# 'HTML' : '#E34F26',
# 'CSS' : '#1572B6',
# 'TypeScript' : '#3178C6',
# 'Shell' : '#FFD500',
# 'SCSS' : '#1572B6',
# 'Dockerfile' : '#2496ED',
# 'Solidity' : '#363636',
# 'Vue' : '#4FC08D',
# }

RANDOM_COLOR = {
'0' : '#F7DF1E',
'1' : '#007396',
'2' : '#3776AB',
'3' : '#E34F26',
'4' : '#1572B6',
'5' : '#3178C6',
'6' : '#FFD500',
'7' : '#1572B6',
'8' : '#2496ED',
'9' : '#363636',
'10' : '#4FC08D',
}

class UrlSettings(object):
    def __init__(self, request, repo_type):
        if repo_type == 'repo':
            print('🎨',repo_type)
            self.api_server = 'https://repomon.kr/api/v1/repo/'
            self.repo_handle = request.GET.get("repoId", "5")
            self.repo_information_url = self.api_server + self.repo_handle + '/card/detail'
            print('🎨',self.repo_information_url)
        elif repo_type == 'repo_personal':
            print('🎨',repo_type)
            self.api_server = 'https://repomon.kr/api/v1/repo/'
            self.repo_handle = request.GET.get("repoId", "1")
            self.user_handle = request.GET.get("userId", "1")
            self.repo_information_url = self.api_server + self.repo_handle + '/card/personal?userId=' + self.user_handle
            print('🎨🖼',self.repo_information_url)
        elif repo_type == 'user':
            print('🎨',repo_type)
            self.api_server = 'https://repomon.kr/api/v1/user/'
            self.repo_handle = request.GET.get("userId", "4")
            self.repo_information_url = self.api_server + self.repo_handle + '/card'
            print('🎨🖼',self.repo_information_url)
    

class RepoDefaultSettings(object):
    def __init__(self, request, url_set):
        try:
            self.json = requests.get(url_set.repo_information_url).json()
            print('🎀')
            print(self.json)
            if 'status' not in self.json:
                print('yes~')    
                self.repomonId = self.repomonId(self.json['repomonId'])
                self.repoExp = self.json['repoExp']
                self.repomonTier = self.json['repomonTier']
                self.repoName = self.json['repoName']
                self.contributers = self.json['contributers']
                self.repoStart = self.day(self.json['repoStart'])
                self.repoEnd = self.day(self.json['repoEnd'])
                self.languages = languageCount(self.json['languages'])
                self.totalcommit = self.json['totalcommit']
                self.totalcode = self.json['totalcode']
                self.starCnt = self.json['starCnt']
                self.forkCnt = self.json['forkCnt']
                self.commits = self.json['commits']
                self.issues = self.json['issues']
                self.merges = self.json['merges']
                self.reviews = self.json['reviews']
                self.conventionrate = int(self.json['conventionrate'])
                self.conventionrate_percent = self.percent(self.json['conventionrate'])
                self.chart = svg_chart([self.commits, self.issues, self.reviews, self.forkCnt, self.starCnt, self.merges])
            else:
                self.repomonId = 1
                self.repoExp = 123456
                self.repomonTier = 1
                self.repoName = '레포몬'
                self.contributers = 6
                self.repoStart = '23.03.10'
                self.repoEnd = '23.04.20'
                self.languages = [('JavaScript', '#F7DF1E',0,60),('Java','#007396',65,30),('','0','0','0'),('','0','0','0'),('','0','0','0'),('','0','0','0')]
                self.totalcommit = 123456
                self.totalcode = 654321
                self.starCnt = 10
                self.forkCnt = 5
                self.commits = 82
                self.issues = 75
                self.merges = 70
                self.reviews = 80
                self.conventionrate = 60
                self.conventionrate_percent = self.percent(self.conventionrate)
                self.chart = svg_chart([self.commits, self.merges, self.issues, self.reviews, self.starCnt, self.forkCnt])

        except JSONDecodeError as e:
            logger.error(e)
            self.repomonId = 1
            self.repoExp = 123456
            self.repomonTier = 1
            self.repoName = '레포몬'
            self.contributers = 6
            self.repoStart = '23.03.10'
            self.repoEnd = '23.04.20'
            self.languages = [('JavaScript', '#F7DF1E',0,60),('Java','#007396',65,30),('','0','0','0'),('','0','0','0'),('','0','0','0'),('','0','0','0')]
            self.totalcommit = 123456
            self.totalcode = 654321
            self.starCnt = 10
            self.forkCnt = 5
            self.commits = 82
            self.issues = 75
            self.merges = 70
            self.reviews = 80
            self.conventionrate = 60
            self.conventionrate_percent = self.percent(self.conventionrate)
            self.chart = svg_chart([self.commits, self.merges, self.issues, self.reviews, self.starCnt, self.forkCnt])

    def day(self, day):
        if day != None:
            new_day = str(day[2:4])+'.'+str(day[5:7])+'.'+str(day[8:10]) 
            return new_day
        else:
            return ''
        
    def repomonId(self, num):
        if num > 30: 
            return 0
        
    def percent(self, num):
        percent = round(num/100*90)
        return percent
    
    def is_none(self, data):
        if data == None:
            return ''
        else:
            return data

    def text_len(self, data):
        if data != None:
            if len(data) > 25:
                data = data[:24] + '...'
                return data
        else:
            return ''
        

def repo_card(request):
    per = IMG['Per']
    url_set = UrlSettings(request, 'repo')
    handle_set = RepoDefaultSettings(request, url_set)
    svg = '''
    <!DOCTYPE svg PUBLIC
        "-//W3C//DTD SVG 1.1//EN"
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg height="200" width="600"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve">
    <style type="text/css">
    <frame-options policy="SAMEORIGIN"/>
        <![CDATA[
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=block');
            @keyframes fadeIn {{
                0%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            @keyframes delayFadeIn {{
                0%{{
                    opacity:0
                }}
                80%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            .background {{
                fill: url(#grad);
            }}
            text {{
                fill: white;
                font-family: 'Noto Sans KR', sans-serif;
            }}
            text.boj-handle {{
                font-weight: 700;
                font-size: 1.30em;
                animation: fadeIn 1s ease-in-out forwards;

            }}
            text.tier-text {{
                font-weight: 700;
                font-size: 1.45em;
                opacity: 55%;
            }}
            .repo-exp {{
                fill: #000000;
                font-size: 0.8em;
                font-weight: 700;
                text-anchor: middle;
                animation: delayFadeIn 1.8s ease-in-out forwards;
            }}
            .subtitle {{
                font-weight: 500;
                font-size: 0.7em;
            }}
            .language {{
                font-weight: 400;
                font-size: 0.6em;
                text-anchor: middle;
            }}
            .value {{
                font-weight: 400;
                font-size: 0.7em;
            }}
            .percentage {{
                font-weight: 300;
                font-size: 0.8em;
            }}
            .progress {{
                font-size: 0.7em;
            }}
            .item {{
                opacity: 0;
                animation: delayFadeIn 2s ease-in-out forwards;
            }}
            .repomon-img {{
                animation: delayFadeIn 1s ease-in-out forwards;
            }}
            .repo-detail {{
                font-weight: 80;
                font-size: 0.8em;
                animation: fadeIn 1.5s ease-in-out forwards;
            }}
            .lang-tag {{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }}
            .charttitle {{
                font-size: 0.4em;
            }}
            .repo-percent {{
                fill: #000000;
                font-size: 0.6em;
                font-weight: 700;
                text-anchor: middle;
            }}
            .elli1 {{
                fill: #FFF9C1;
                cx: 95px;
                cy: 130px;
                rx: 50px;
                ry: 15px;
            }}
            .elli2 {{
                fill: #C1E9FF;
                cx: 95px;
                cy: 155px;
                rx: 58px;
                ry: 20px;
            }}
            .elli3 {{
                fill: #FF93B3;
                cx: 95px;
                cy: 125px;
                rx: 60px;
                ry: 30px;
            }}
        ]]>
    </style>
<frame-options policy="SAMEORIGIN"/>
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="35%">
            <stop offset="10%" style="stop-color:'#AAAAAA';stop-opacity:1">
                <animate attributeName="stop-opacity" values="0.7; 0.73; 0.9 ; 0.97; 1; 0.97; 0.9; 0.73; 0.7;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="55%" style="stop-color:'#666666';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.95; 0.93; 0.95; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="100%" style="stop-color:'#000000';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.97; 0.9; 0.83; 0.8; 0.83; 0.9; 0.97; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
        </linearGradient>
    </defs>
    <rect width="600" height="200" rx="10" ry="10" class="background"/>
    <ellipse class="{ellipsetype}"/>
    
    <image href="{img}" x="25" y="25" width="140px" height="112px" class="repomon-img"/>
    <line x1="40" y1="170" x2="150" y2="170" stroke-width="20" stroke="floralwhite" stroke-linecap="round"/>
    <text x="100" y="175" dz="-20" class="repo-exp">Exp | {repoExp}</text>

    <text x="190" y="40" class="boj-handle">{repoName}</text>
    <image href="{per}" x="190" y="50" height="13px" width="10px"/><text x="203" y="61" font-size="0.7em">{contributers}</text>
    <text x="225" y="61" font-size="0.7em">{repoStart} ~ {repoEnd}</text>

    <g class="item" style="animation-delay: 200ms">
        <text x="190" y="134" class="subtitle">Total Commit</text><text x="270" y="134" class="rate value">{totalcommit} 회</text>
    </g>
    <g class="item" style="animation-delay: 400ms">
        <text x="190" y="154" class="subtitle">Total code</text><text x="270" y="154" class="solved value">{totalcode} 줄</text>
    </g>
    <g class="item" style="animation-delay: 600ms">
        <text x="190" y="174" class="subtitle">Convention Rate</text><text x="260" y="170" class="class value"></text>
        <line x1="290" y1="169" x2="{conventionrate_percent}" y2="169" stroke-width="10" stroke="floralwhite" stroke-linecap="round"/>
        <line x1="290" y1="169" x2="380" y2="169" stroke-width="10" stroke-opacity="40%" stroke="floralwhite" stroke-linecap="round"/>
        <text x="335" y="173" dz="-30" class="repo-percent">{conventionrate} %</text>
    </g>


    <rect x="{lang0_2}" y="70" rx="5" ry="5" width="{lang0_3}" height="18" style="fill:{lang0_1};"/>
    <text x="{lang0_2t}" y="82" class="language">{lang0_0}</text>

    <rect x="{lang1_2}" y="70" rx="5" ry="5" width="{lang1_3}" height="18" style="fill:{lang1_1};"/>
    <text x="{lang1_2t}" y="82" class="language">{lang1_0}</text>

    <rect x="{lang2_2}" y="70" rx="5" ry="5" width="{lang2_3}" height="18" style="fill:{lang2_1};"/>
    <text x="{lang2_2t}" y="82" class="language">{lang2_0}</text>

    <rect x="{lang3_2}" y="95" rx="5" ry="5" width="{lang3_3}" height="18" style="fill:{lang3_1};"/>
    <text x="{lang3_2t}" y="107" class="language">{lang3_0}</text>

    <rect x="{lang4_2}" y="95" rx="5" ry="5" width="{lang4_3}" height="18" style="fill:{lang4_1};"/>
    <text x="{lang4_2t}" y="107" class="language">{lang4_0}</text>

    <rect x="{lang5_2}" y="95" rx="5" ry="5" width="{lang5_3}" height="18" style="fill:{lang5_1};"/>
    <text x="{lang5_2t}" y="107" class="language">{lang5_0}</text>


    <image href="{chart}" x="425" y="25" height="160px" class="repomon-img"/>
    <text x="502" y="28" class="charttitle">Commit</text>
    <text x="575" y="70" class="charttitle">Merge</text>
    <text x="432" y="70" class="charttitle">Issue</text>
    <text x="432" y="137" class="charttitle">Review</text>
    <text x="575" y="137" class="charttitle">Star</text>
    <text x="504" y="178" class="charttitle">Fork</text>
</svg>
    '''.format( repoName = handle_set.repoName,
                repoExp = handle_set.repoExp,
                starCnt = handle_set.starCnt,
                forkCnt = handle_set.forkCnt,
                repoStart = handle_set.repoStart,
                repoEnd = handle_set.repoEnd,
                contributers = handle_set.contributers,
                conventionrate = handle_set.conventionrate,
                conventionrate_percent = handle_set.conventionrate_percent + 290,
                totalcommit = handle_set.totalcommit,
                totalcode = handle_set.totalcode,
                per=per,
                img=IMG['img'+str(handle_set.repomonId)],
                ellipsetype=ELLIPSE_TYPE[handle_set.repomonTier],
                lang0_0=handle_set.languages[0][0],
                lang0_1=handle_set.languages[0][1],
                lang0_2=int(handle_set.languages[0][2]) + 190,
                lang0_2t=int(handle_set.languages[0][2]) + 190 + int(handle_set.languages[0][3])/2,
                lang0_3=int(handle_set.languages[0][3]),
                lang1_0=handle_set.languages[1][0],
                lang1_1=handle_set.languages[1][1],
                lang1_2=int(handle_set.languages[1][2]) + 190,
                lang1_2t=int(handle_set.languages[1][2]) + 190 + int(handle_set.languages[1][3])/2,
                lang1_3=int(handle_set.languages[1][3]),
                lang2_0=handle_set.languages[2][0],
                lang2_1=handle_set.languages[2][1],
                lang2_2=int(handle_set.languages[2][2]) + 190,
                lang2_2t=int(handle_set.languages[2][2]) + 190 + int(handle_set.languages[2][3])/2,
                lang2_3=int(handle_set.languages[2][3]),
                lang3_0=handle_set.languages[3][0],
                lang3_1=handle_set.languages[3][1],
                lang3_2=int(handle_set.languages[3][2]) + 190,
                lang3_2t=int(handle_set.languages[3][2]) + 190 + int(handle_set.languages[3][3])/2,
                lang3_3=int(handle_set.languages[3][3]),
                lang4_0=handle_set.languages[4][0],
                lang4_1=handle_set.languages[4][1],
                lang4_2=int(handle_set.languages[4][2]) + 190,
                lang4_2t=int(handle_set.languages[4][2]) + 190 + int(handle_set.languages[4][3])/2,
                lang4_3=int(handle_set.languages[4][3]),
                lang5_0=handle_set.languages[5][0],
                lang5_1=handle_set.languages[5][1],
                lang5_2=int(handle_set.languages[5][2]) + 190,
                lang5_2t=int(handle_set.languages[5][2]) + 190 + int(handle_set.languages[5][3])/2,
                lang5_3=int(handle_set.languages[5][3]),
                chart=handle_set.chart
               )

    response = HttpResponse(content=svg)
    response['Content-Type'] = 'image/svg+xml'
    response['Cache-Control'] = 'max-age=3600'

    return response


class RepoPersonalDefaultSettings(object):
    def __init__(self, request, url_set):
        try:
            self.json = requests.get(url_set.repo_information_url).json()
            print('🎀')
            print(self.json)
            if 'status' not in self.json:
                print('yes~')    
                self.repomonId = self.json['repomonId']
                self.repoExp = self.json['repoExp']
                self.repomonTier = self.json['repomonTier']
                self.contribution = self.json['conventionrate']
                self.repoName = self.json['repoName']
                self.contributers = self.json['contributers']
                self.repoStart = self.day(self.json['repoStart'])
                self.repoEnd = self.day(self.json['repoEnd'])
                self.languages = languageCount(self.json['languages'])
                self.totalcommit = self.json['totalcommit']
                self.totalcode = self.json['totalcode']
                self.mytotalcommit = self.json['mytotalcommit']
                self.mytotalcode = self.json['mytotalcode']
                self.conventionrate = self.json['conventionrate']
                self.conventionrate_percent = self.percent(self.json['conventionrate'])

                self.starCnt = self.json['starCnt']
                self.forkCnt = self.json['forkCnt']
                self.commits = self.json['commits']
                self.issues = self.json['issues']
                self.merges = self.json['merges']
                self.reviews = self.json['reviews']

                self.gitname = self.json['userName'] 
                self.avatarUrl = self.json['avatarUrl'] 

                self.mycommits = self.json['mytotalcommit']
                self.myissues = self.json['myissues']
                self.mymerges = self.json['mymerges']
                self.myreviews = self.json['myreviews']

                self.chart = svg_chart_personal([self.commits, self.issues, self.reviews, self.forkCnt, self.starCnt, self.merges],[self.mycommits, self.myissues, self.myreviews, self.forkCnt, self.starCnt, self.mymerges])
            else:
                self.repomonId = 0
                self.repoExp = 12345
                self.repomonTier = 0
                self.contribution = 30
                self.repoName = '레포몬'
                self.contributers = 1
                self.repoStart = '23.03.10'
                self.repoEnd = '23.04.20'
                self.languages = [('Java', '#007396', '0', '30'), ('Vue', '#4FC08D', '35', '25'), ('Python', '#3776AB', '65', '40'), ('TypeScript', '#3178C6', '0', '60'), ('CSS', '#1572B6', '65', '25'), ('HTML', '#E34F26', '95', '30'), ('', '0', '0', '0')]

                self.totalcommit = 12345
                self.totalcode = 123456
                self.mytotalcommit = 1234
                self.mytotalcode = 12345
                self.conventionrate = 77
                self.conventionrate_percent = self.percent(self.conventionrate)

                self.starCnt = 5000
                self.forkCnt = 4000
                self.commits = 12345
                self.issues = 7000
                self.merges = 8000
                self.reviews = 4800

                self.gitname = '로켓단'
                self.avatarUrl = IMG['img0']

                self.mycommits = 10000
                self.myissues = 6000
                self.mymerges = 5000
                self.myreviews = 4800

                self.chart = svg_chart_personal([self.commits, self.issues, self.reviews, self.forkCnt, self.starCnt, self.merges],[self.mycommits, self.myissues, self.myreviews, self.forkCnt, self.starCnt, self.mymerges])

        except JSONDecodeError as e:
            logger.error(e)
            self.repomonId = 1
            self.repoExp = 12345
            self.repomonTier = 1
            self.contribution = 30
            self.repoName = '레포몬'
            self.contributers = 1
            self.repoStart = '23.03.10'
            self.repoEnd = '23.04.20'
            self.languages = [('Java', '#007396', '0', '30'), ('Vue', '#4FC08D', '35', '25'), ('Python', '#3776AB', '65', '40'), ('TypeScript', '#3178C6', '0', '60'), ('CSS', '#1572B6', '65', '25'), ('HTML', '#E34F26', '95', '30'), ('', '0', '0', '0')]

            self.totalcommit = 12345
            self.totalcode = 123456
            self.mytotalcommit = 1234
            self.mytotalcode = 12345
            self.conventionrate = 77
            self.conventionrate_percent = self.percent(self.conventionrate)

            self.starCnt = 5000
            self.forkCnt = 4000
            self.commits = 12345
            self.issues = 7000
            self.merges = 8000
            self.reviews = 4800

            self.gitname = '로켓단'
            self.avatarUrl = IMG['img0']

            self.mycommits = 10000
            self.myissues = 6000
            self.mymerges = 5000
            self.myreviews = 4800

            self.chart = svg_chart_personal([self.commits, self.issues, self.reviews, self.forkCnt, self.starCnt, self.merges],[self.mycommits, self.myissues, self.myreviews, self.forkCnt, self.starCnt, self.mymerges])

    def day(self, day):
        if day != None:
            new_day = str(day[2:4])+'.'+str(day[5:7])+'.'+str(day[8:10]) 
            return new_day
        else:
            return ''
        
    def percent(self, num):
        percent = round(num/100*90)
        return percent
    
    def is_none(self, data):
        if data == None:
            return ''
        else:
            return data

def repo_personal_card(request):
    per = IMG['Per']
    url_set = UrlSettings(request, 'repo_personal')
    handle_set = RepoPersonalDefaultSettings(request, url_set)
    svg = '''
    <!DOCTYPE svg PUBLIC
        "-//W3C//DTD SVG 1.1//EN"
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg height="230" width="600"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve">
    <style type="text/css">
    <frame-options policy="SAMEORIGIN"/>
        <![CDATA[
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=block');
            @keyframes fadeIn {{
                0%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            @keyframes delayFadeIn {{
                0%{{
                    opacity:0
                }}
                80%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            .background {{
                fill: url(#grad);
            }}
            text {{
                fill: white;
                font-family: 'Noto Sans KR', sans-serif;
            }}
            text.repo_title {{
                font-weight: 700;
                font-size: 1.7em;
                animation: fadeIn 1s ease-in-out forwards;

            }}
            text.tier-text {{
                font-weight: 700;
                font-size: 1.45em;
                opacity: 55%;
            }}
            .repo-exp {{
                fill: #000000;
                font-size: 0.8em;
                font-weight: 700;
                text-anchor: middle;
                animation: delayFadeIn 1.8s ease-in-out forwards;
            }}
            .subtitle {{
                font-weight: 500;
                font-size: 0.7em;
            }}
            .language {{
                font-weight: 400;
                font-size: 0.6em;
                text-anchor: middle;
            }}
            .value {{
                font-weight: 400;
                font-size: 0.7em;
            }}
            .value2 {{
                font-weight: 400;
                font-size: 0.6em;
            }}
            .percentage {{
                font-weight: 300;
                font-size: 0.8em;
            }}
            .progress {{
                font-size: 0.7em;
            }}
            .item {{
                opacity: 0;
                animation: delayFadeIn 2s ease-in-out forwards;
            }}
            .repomon-img {{
                animation: delayFadeIn 1s ease-in-out forwards;
            }}
            .repo-detail {{
                font-size: 0.8em;
                animation: fadeIn 1.5s ease-in-out forwards;
            }}
            .lang-tag {{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }}
            .charttitle {{
                font-size: 0.5em;
            }}
            .repo-percent {{
                fill: #000000;
                font-size: 0.6em;
                font-weight: 700;
                text-anchor: middle;
            }}
            .elli1 {{
                fill: #FFF9C1;
                cx: 95px;
                cy: 145px;
                rx: 50px;
                ry: 15px;
            }}
            .elli2 {{
                fill: #C1E9FF;
                cx: 95px;
                cy: 145px;
                rx: 58px;
                ry: 20px;
            }}
            .elli3 {{
                fill: #FF93B3;
                cx: 95px;
                cy: 135px;
                rx: 60px;
                ry: 30px;
            }}
        ]]>
    </style>
<frame-options policy="SAMEORIGIN"/>
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="35%">
            <stop offset="10%" style="stop-color:'#AAAAAA';stop-opacity:1">
                <animate attributeName="stop-opacity" values="0.7; 0.73; 0.9 ; 0.97; 1; 0.97; 0.9; 0.73; 0.7;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="55%" style="stop-color:'#666666';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.95; 0.93; 0.95; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="100%" style="stop-color:'#000000';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.97; 0.9; 0.83; 0.8; 0.83; 0.9; 0.97; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
        </linearGradient>
    </defs>
    <defs>
        <pattern id="avatarUrl" x="0" y="0" patternContentUnits="objectBoundingBox" width="100%" height="100%">
            <image x="0" y="0" width="1" height="1" preserveAspectRatio = "none" href="{avatarUrl}"/>
        </pattern>
    </defs>
    <rect width="600" height="230" rx="10" ry="10" class="background"/>
    
    <circle cx="29" cy="23" r="11" fill="url(#avatarUrl)"/>

    <text x="45" y="27" font-size="0.75em">{gitname}</text>
    
    <ellipse class="{ellipsetype}"/>
    
    <image href="{img}" x="25" y="42" width="140px" height="112px" class="repomon-img"/>
    <line x1="40" y1="183" x2="150" y2="183" stroke-width="20" stroke="floralwhite" stroke-linecap="round"/>
    <text x="100" y="188" dz="-20" class="repo-exp">Exp | {repoExp}</text>
    <text x="95" y="210" text-anchor="middle" font-size="0.7em">My contribution : {contribution}%</text>

    <text x="190" y="48" class="repo_title">{repoName}</text>
    <image href="{per}" x="190" y="61" height="13px" width="10px"/><text x="203" y="72" font-size="0.7em">{contributers}</text>
    <text x="225" y="72" font-size="0.7em">{repoStart} ~ {repoEnd}</text>

    <g class="item" style="animation-delay: 400ms">
        <text x="190" y="151" class="subtitle">Total Code</text><text x="270" y="151" class="solved value">{mytotalcode} / {totalcode}줄</text>
    </g>
    <g class="item" style="animation-delay: 200ms">
        <text x="190" y="175" class="subtitle">Total Commit</text><text x="270" y="175" class="rate value">{mytotalcommit} / {totalcommit} 회</text>
    </g>
    <g class="item" style="animation-delay: 600ms">
        <text x="190" y="199" class="subtitle">Convention Rate</text>
        <line x1="300" y1="195" x2="{conventionrate_percent}" y2="195" stroke-width="10" stroke="floralwhite" stroke-linecap="round"/>
        <line x1="300" y1="195" x2="390" y2="195" stroke-width="10" stroke-opacity="40%" stroke="floralwhite" stroke-linecap="round"/>
        <text x="345" y="199" dz="-30" class="repo-percent">{conventionrate} %</text>
    </g>

    <rect x="{lang0_2}" y="85" rx="5" ry="5" width="{lang0_3}" height="18" style="fill:{lang0_1};"/>
    <text x="{lang0_2t}" y="97" class="language">{lang0_0}</text>

    <rect x="{lang1_2}" y="85" rx="5" ry="5" width="{lang1_3}" height="18" style="fill:{lang1_1};"/>
    <text x="{lang1_2t}" y="97" class="language">{lang1_0}</text>

    <rect x="{lang2_2}" y="85" rx="5" ry="5" width="{lang2_3}" height="18" style="fill:{lang2_1};"/>
    <text x="{lang2_2t}" y="97" class="language">{lang2_0}</text>

    <rect x="{lang3_2}" y="110" rx="5" ry="5" width="{lang3_3}" height="18" style="fill:{lang3_1};"/>
    <text x="{lang3_2t}" y="122" class="language">{lang3_0}</text>

    <rect x="{lang4_2}" y="110" rx="5" ry="5" width="{lang4_3}" height="18" style="fill:{lang4_1};"/>
    <text x="{lang4_2t}" y="122" class="language">{lang4_0}</text>

    <rect x="{lang5_2}" y="110" rx="5" ry="5" width="{lang5_3}" height="18" style="fill:{lang5_1};"/>
    <text x="{lang5_2t}" y="122" class="language">{lang5_0}</text>


    <image href="{chart}" x="370" y="12" height="220px" class="repomon-img"/>
    <text x="479" y="22" class="charttitle">Commit</text>
    <text x="572" y="73" class="charttitle">Merge</text>
    <text x="395" y="73" class="charttitle">Issue</text>
    <text x="393" y="165" class="charttitle">Review</text>
    <text x="572" y="165" class="charttitle">Star</text>
    <text x="485" y="215" class="charttitle">Fork</text>
</svg>
    '''.format(repoName = handle_set.repoName,
               repoExp = handle_set.repoExp,
               starCnt = handle_set.starCnt,
               forkCnt = handle_set.forkCnt,
               repoStart = handle_set.repoStart,
               repoEnd = handle_set.repoEnd,
               contributers = handle_set.contributers,
               conventionrate = handle_set.conventionrate,
               conventionrate_percent = handle_set.conventionrate_percent + 300,
               totalcommit = handle_set.totalcommit,
               totalcode = handle_set.totalcode,
               contribution = handle_set.contribution,
               gitname = handle_set.gitname,
               avatarUrl = handle_set.avatarUrl,
               mytotalcommit = handle_set.mytotalcommit,
               mytotalcode = handle_set.mytotalcommit,
               per=per,
               img=IMG['img'+str(handle_set.repomonId)],
               ellipsetype=ELLIPSE_TYPE[handle_set.repomonTier],                
               lang0_0=handle_set.languages[0][0],
                lang0_1=handle_set.languages[0][1],
                lang0_2=int(handle_set.languages[0][2]) + 190,
                lang0_2t=int(handle_set.languages[0][2]) + 190 + int(handle_set.languages[0][3])/2,
                lang0_3=int(handle_set.languages[0][3]),
                lang1_0=handle_set.languages[1][0],
                lang1_1=handle_set.languages[1][1],
                lang1_2=int(handle_set.languages[1][2]) + 190,
                lang1_2t=int(handle_set.languages[1][2]) + 190 + int(handle_set.languages[1][3])/2,
                lang1_3=int(handle_set.languages[1][3]),
                lang2_0=handle_set.languages[2][0],
                lang2_1=handle_set.languages[2][1],
                lang2_2=int(handle_set.languages[2][2]) + 190,
                lang2_2t=int(handle_set.languages[2][2]) + 190 + int(handle_set.languages[2][3])/2,
                lang2_3=int(handle_set.languages[2][3]),
                lang3_0=handle_set.languages[3][0],
                lang3_1=handle_set.languages[3][1],
                lang3_2=int(handle_set.languages[3][2]) + 190,
                lang3_2t=int(handle_set.languages[3][2]) + 190 + int(handle_set.languages[3][3])/2,
                lang3_3=int(handle_set.languages[3][3]),
                lang4_0=handle_set.languages[4][0],
                lang4_1=handle_set.languages[4][1],
                lang4_2=int(handle_set.languages[4][2]) + 190,
                lang4_2t=int(handle_set.languages[4][2]) + 190 + int(handle_set.languages[4][3])/2,
                lang4_3=int(handle_set.languages[4][3]),
                lang5_0=handle_set.languages[5][0],
                lang5_1=handle_set.languages[5][1],
                lang5_2=int(handle_set.languages[5][2]) + 190,
                lang5_2t=int(handle_set.languages[5][2]) + 190 + int(handle_set.languages[5][3])/2,
                lang5_3=int(handle_set.languages[5][3]),
               chart=handle_set.chart
               )

    response = HttpResponse(content=svg)
    response['Content-Type'] = 'image/svg+xml'
    response['Cache-Control'] = 'max-age=3600'

    return response


class UserDefaultSettings(object):
    def __init__(self, request, url_set):
        try:
            self.json = requests.get(url_set.repo_information_url).json()
            print('🎀')
            print(self.json)
            if 'status' not in self.json:
                self.myrepomonId = self.json['myrepomonId']
                self.myrepoExp = self.json['myrepoExp']
                self.myrepomonTier = self.json['myrepomonTier']
                self.myrepoName = self.json['myrepoName']
                self.totalExp = self.json['totalExp']

                self.totalCommitCount = self.json['totalCommitCount']
                self.totalCodeLineCount = self.json['totalCodeLineCount']
                self.languages = languageCount(self.json['languages'])

                self.totalMergeCount = self.json['totalMergeCount']
                self.totalReviewCount = self.json['totalReviewCount']
                self.totalIssueCount = self.json['totalIssueCount']
                self.starCount = self.json['starCount']
                self.forkCount = self.json['forkCount']

                self.avgContribution = int(self.json['avgContribution'])
                self.avgContribution_percent = self.percent(self.avgContribution)

                self.userName = self.json['userName'] 
                self.avatarUrl = self.json['avatarUrl'] 
                self.introduce = self.is_none(self.json['introduce']) 
                self.repoCount = self.json['repoCount'] 
            
                self.chart = svg_chart([self.totalCommitCount, self.totalMergeCount, self.totalIssueCount, self.totalReviewCount, self.starCount, self.forkCount])
            else:
                self.myrepomonId = 3
                self.myrepoExp = 321
                self.myrepomonTier = 3
                self.myrepoName = '레포몬'
                self.totalExp = 12345

                self.totalCommitCount = 54321
                self.totalCodeLineCount = 1234567
                self.languages = [('Java', '#007396', '0', '30'), ('Vue', '#4FC08D', '35', '25'), ('Python', '#3776AB', '65', '40'), ('TypeScript', '#3178C6', '0', '60'), ('CSS', '#1572B6', '65', '25'), ('HTML', '#E34F26', '95', '30'), ('', '0', '0', '0')]

                self.totalMergeCount = 30
                self.totalReviewCount = 20
                self.totalIssueCount = 10
                self.starCount = 5
                self.forkCount = 3

                self.avgContribution = 77
                self.avgContribution_percent = self.percent(self.avgContribution)

                self.userName = '로켓단'
                self.avatarUrl = IMG['img0']
                self.introduce = '주소를 다시 확인해주세요'
                self.repoCount = 0 
                self.chart = svg_chart([self.totalCommitCount, self.totalMergeCount, self.totalIssueCount, self.totalReviewCount, self.starCount, self.forkCount])
        
        except JSONDecodeError as e:
            logger.error(e)
            self.myrepomonId = 0
            self.myrepoExp = 321
            self.myrepomonTier = 1
            self.myrepoName = '레포몬'
            self.totalExp = 12345

            self.totalCommitCount = 54321
            self.totalCodeLineCount = 1234567
            self.languages = [('Java', '#007396', '0', '30'), ('Vue', '#4FC08D', '35', '25'), ('Python', '#3776AB', '65', '40'), ('TypeScript', '#3178C6', '0', '60'), ('CSS', '#1572B6', '65', '25'), ('HTML', '#E34F26', '95', '30'), ('', '0', '0', '0')]

            self.totalMergeCount = 30
            self.totalReviewCount = 20
            self.totalIssueCount = 10
            self.starCount = 5
            self.forkCount = 3

            self.avgContribution = 77
            self.avgContribution_percent = self.percent(self.avgContribution)

            self.userName = '로켓단'
            self.avatarUrl = IMG[img0]
            self.introduce = '주소를 다시 확인해주세요'
            self.repoCount = 0 
            self.chart = svg_chart([self.totalCommitCount, self.totalMergeCount, self.totalIssueCount, self.totalReviewCount, self.starCount, self.forkCount])
        
    def percent(self, num):
        percent = round(num/100*80)
        return percent
    
    def is_none(self, data):
        if data == None:
            return ''
        else:
            return data

def user_card(request):
    pocket = IMG['pocket']
    url_set = UrlSettings(request, 'user')
    handle_set = UserDefaultSettings(request, url_set)
    svg = '''
    <!DOCTYPE svg PUBLIC
        "-//W3C//DTD SVG 1.1//EN"
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg height="230" width="600"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve">
    <style type="text/css">
    <frame-options policy="SAMEORIGIN"/>
        <![CDATA[
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=block');
            @keyframes fadeIn {{
                0%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            @keyframes delayFadeIn {{
                0%{{
                    opacity:0
                }}
                80%{{
                    opacity:0
                }}
                100%{{
                    opacity:1
                }}
            }}
            .background {{
                fill: url(#grad);
            }}
            text {{
                fill: white;
                font-family: 'Noto Sans KR', sans-serif;
            }}
            text.repo-handle {{
                font-weight: 700;
                font-size: 1.30em;
                animation: fadeIn 1s ease-in-out forwards;

            }}
            text.tier-text {{
                font-weight: 700;
                font-size: 1.45em;
                opacity: 55%;
            }}
            .repo-exp {{
                fill: #000000;
                font-size: 0.8em;
                font-weight: 700;
                text-anchor: middle;
                animation: delayFadeIn 1.8s ease-in-out forwards;
            }}
            .subtitle {{
                font-weight: 500;
                font-size: 0.7em;
            }}
            .language {{
                font-weight: 400;
                font-size: 0.6em;
                text-anchor: middle;
            }}
            .value {{
                font-weight: 400;
                font-size: 0.7em;
            }}
            .percentage {{
                font-weight: 300;
                font-size: 0.8em;
            }}
            .progress {{
                font-size: 0.7em;
            }}
            .item {{
                opacity: 0;
                animation: delayFadeIn 2s ease-in-out forwards;
            }}
            .repomon-img {{
                animation: delayFadeIn 1s ease-in-out forwards;
            }}
            .repo-detail {{
                font-size: 0.8em;
                animation: fadeIn 1.5s ease-in-out forwards;
            }}
            .lang-tag {{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }}
            .charttitle {{
                font-size: 0.5em;
            }}
            .repo-percent {{
                fill: #000000;
                font-size: 0.6em;
                font-weight: 700;
                text-anchor: middle;
            }}
            .elli1 {{
                fill: #FFF9C1;
                cx: 95px;
                cy: 145px;
                rx: 50px;
                ry: 15px;
            }}
            .elli2 {{
                fill: #C1E9FF;
                cx: 95px;
                cy: 148px;
                rx: 58px;
                ry: 20px;
            }}
            .elli3 {{
                fill: #FF93B3;
                cx: 95px;
                cy: 140px;
                rx: 60px;
                ry: 27px;
            }}
        ]]>
    </style>
<frame-options policy="SAMEORIGIN"/>
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="35%">
            <stop offset="10%" style="stop-color:'#AAAAAA';stop-opacity:1">
                <animate attributeName="stop-opacity" values="0.7; 0.73; 0.9 ; 0.97; 1; 0.97; 0.9; 0.73; 0.7;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="55%" style="stop-color:'#666666';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.95; 0.93; 0.95; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
            <stop offset="100%" style="stop-color:'#000000';stop-opacity:1">
                <animate attributeName="stop-opacity" values="1; 0.97; 0.9; 0.83; 0.8; 0.83; 0.9; 0.97; 1;" dur="4s" repeatCount="indefinite" repeatDur="01:00"></animate>
            </stop>
        </linearGradient>
    </defs>
    <defs>
        <pattern id="avatarUrl" x="0" y="0" patternContentUnits="objectBoundingBox" width="100%" height="100%">
            <image x="0" y="0" width="1" height="1" preserveAspectRatio = "none" href="{avatarUrl}"/>
        </pattern>
    </defs>
    <rect width="600" height="230" rx="10" ry="10" class="background"/>
    
    <circle cx="213" cy="43" r="22" fill="url(#avatarUrl)"/>
    <text x="241" y="41" class="repo-handle">{gitname}</text>
    <image href="{pocket}" x="241" y="50" width="14px"/><text x="259" y="61" font-size="0.6em">{repoCount}</text>
    <text x="275" y="62" font-size="0.75em">{introduce}</text>

    <ellipse class="{ellipsetype}"/>

    <text x="95" y="33" text-anchor="middle" font-size="0.5em">My Representive Repo</text>
    <image href="{img}" x="25" y="45" width="140px" height="112px" class="repomon-img"/>
    <line x1="40" y1="183" x2="150" y2="183" stroke-width="20" stroke="floralwhite" stroke-linecap="round"/>
    <text x="95" y="188" dz="-20" class="repo-exp" text-anchor="middle">Exp | {repoExp}</text>
    <text font-size="0.9em" font-weight="800" x="95" y="211" text-anchor="middle">{repoName}</text>

    <g class="item" style="animation-delay: 200ms">
        <text x="195" y="136" class="subtitle">Total Exp</text><text x="270" y="136" class="rate value">{totalexp} 점</text>
    </g>
    <g class="item" style="animation-delay: 200ms">
        <text x="195" y="159" class="subtitle">Total Code</text><text x="270" y="159" class="rate value">{totalcode} 줄</text>
    </g>
    <g class="item" style="animation-delay: 400ms">
        <text x="195" y="182" class="subtitle">Total Commit</text><text x="275" y="182" class="solved value">{totalcommit} 회</text>
    </g>
    <g class="item" style="animation-delay: 600ms">
        <text x="195" y="205" class="subtitle">Average Contribution</text><text x="260" y="205" class="class value"></text>
        <line x1="320" y1="201" x2="{conventionrate_percent}" y2="201" stroke-width="10" stroke="floralwhite" stroke-linecap="round"/>
        <line x1="320" y1="201" x2="400" y2="201" stroke-width="10" stroke-opacity="40%" stroke="floralwhite" stroke-linecap="round"/>
        <text x="360" y="205" dz="-30" class="repo-percent">{conventionrate} %</text>
    </g>

    
    <rect x="{lang0_2}" y="74" rx="5" ry="5" width="{lang0_3}" height="18" style="fill:{lang0_1};"/>
    <text x="{lang0_2t}" y="86" class="language">{lang0_0}</text>

    <rect x="{lang1_2}" y="74" rx="5" ry="5" width="{lang1_3}" height="18" style="fill:{lang1_1};"/>
    <text x="{lang1_2t}" y="86" class="language">{lang1_0}</text>

    <rect x="{lang2_2}" y="74" rx="5" ry="5" width="{lang2_3}" height="18" style="fill:{lang2_1};"/>
    <text x="{lang2_2t}" y="86" class="language">{lang2_0}</text>

    <rect x="{lang3_2}" y="99" rx="5" ry="5" width="{lang3_3}" height="18" style="fill:{lang3_1};"/>
    <text x="{lang3_2t}" y="111" class="language">{lang3_0}</text>

    <rect x="{lang4_2}" y="99" rx="5" ry="5" width="{lang4_3}" height="18" style="fill:{lang4_1};"/>
    <text x="{lang4_2t}" y="111" class="language">{lang4_0}</text>

    <rect x="{lang5_2}" y="99" rx="5" ry="5" width="{lang5_3}" height="18" style="fill:{lang5_1};"/>
    <text x="{lang5_2t}" y="111" class="language">{lang5_0}</text>


    <image href="{chart}" x="370" y="12" height="220px" class="repomon-img"/>
    <text x="479" y="22" class="charttitle">Commit</text>
    <text x="572" y="73" class="charttitle">Merge</text>
    <text x="395" y="73" class="charttitle">Issue</text>
    <text x="393" y="165" class="charttitle">Review</text>
    <text x="572" y="165" class="charttitle">Star</text>
    <text x="485" y="215" class="charttitle">Fork</text>
</svg>
    '''.format(repoExp = handle_set.myrepoExp,
               repoName = handle_set.myrepoName,
               img=IMG['img'+str(handle_set.myrepomonId)],
               ellipsetype=ELLIPSE_TYPE[handle_set.myrepomonTier],
               totalexp = handle_set.totalExp,
               totalcode = handle_set.totalCodeLineCount,
               totalcommit = handle_set.totalCommitCount,
               conventionrate_percent = handle_set.avgContribution_percent + 320,
               conventionrate = handle_set.avgContribution,
               gitname = handle_set.userName,
               avatarUrl = handle_set.avatarUrl,
               introduce = handle_set.introduce,
               repoCount = handle_set.repoCount,
                lang0_0=handle_set.languages[0][0],
                lang0_1=handle_set.languages[0][1],
                lang0_2=int(handle_set.languages[0][2]) + 195,
                lang0_2t=int(handle_set.languages[0][2]) + 195 + int(handle_set.languages[0][3])/2,
                lang0_3=int(handle_set.languages[0][3]),
                lang1_0=handle_set.languages[1][0],
                lang1_1=handle_set.languages[1][1],
                lang1_2=int(handle_set.languages[1][2]) + 195,
                lang1_2t=int(handle_set.languages[1][2]) + 195 + int(handle_set.languages[1][3])/2,
                lang1_3=int(handle_set.languages[1][3]),
                lang2_0=handle_set.languages[2][0],
                lang2_1=handle_set.languages[2][1],
                lang2_2=int(handle_set.languages[2][2]) + 195,
                lang2_2t=int(handle_set.languages[2][2]) + 195 + int(handle_set.languages[2][3])/2,
                lang2_3=int(handle_set.languages[2][3]),
                lang3_0=handle_set.languages[3][0],
                lang3_1=handle_set.languages[3][1],
                lang3_2=int(handle_set.languages[3][2]) + 195,
                lang3_2t=int(handle_set.languages[3][2]) + 195 + int(handle_set.languages[3][3])/2,
                lang3_3=int(handle_set.languages[3][3]),
                lang4_0=handle_set.languages[4][0],
                lang4_1=handle_set.languages[4][1],
                lang4_2=int(handle_set.languages[4][2]) + 195,
                lang4_2t=int(handle_set.languages[4][2]) + 195 + int(handle_set.languages[4][3])/2,
                lang4_3=int(handle_set.languages[4][3]),
                lang5_0=handle_set.languages[5][0],
                lang5_1=handle_set.languages[5][1],
                lang5_2=int(handle_set.languages[5][2]) + 195,
                lang5_2t=int(handle_set.languages[5][2]) + 195 + int(handle_set.languages[5][3])/2,
                lang5_3=int(handle_set.languages[5][3]),
               pocket=pocket,
               chart=handle_set.chart
               )

    response = HttpResponse(content=svg)
    response['Content-Type'] = 'image/svg+xml'
    response['Cache-Control'] = 'max-age=3600'

    return response

