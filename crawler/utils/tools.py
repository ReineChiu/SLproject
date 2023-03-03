import re

def get_table(soup):
    all_td = soup.find_all("td") 
    tds = [td.text for td in all_td]
    tds = [item.strip() for item in tds]
    tds = [x for num in tds for x in re.split(r'\s+', num)]
    return tds

def convert_list(tds):
    convert_data = []
    for item in tds:
        if item.isdigit():
            convert_data.append(int(item))
        elif item.replace(".", "", 1).isdigit():
            convert_data.append(float(item))
        else:
            convert_data.append(item.replace("（", "(").replace("）", ")"))
    return convert_data
