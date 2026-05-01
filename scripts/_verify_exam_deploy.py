import urllib.request
import re
url = "https://hosxam.github.io/deutsch-klinik/assets/index-o-PRdsl8.js"
r = urllib.request.urlopen(url)
t = r.read().decode("utf-8", errors="replace")
exams = re.findall(r"A1_exam_\d+", t)
print("A1_exam IDs:", len(set(exams)), sorted(set(exams)))
lesen = re.findall(r"A1_ex_l\d+_\d+", t)
horen = re.findall(r"A1_ex_h\d+_\d+", t)
schreiben = re.findall(r"A1_ex_w\d+_\d+", t)
sprechen = re.findall(r"A1_ex_s\d+_\d+", t)
print("Lesen tasks:", len(set(lesen)))
print("Horen tasks:", len(set(horen)))
print("Schreiben tasks:", len(set(schreiben)))
print("Sprechen tasks:", len(set(sprechen)))
all_t = lesen + horen + schreiben + sprechen
print("Total tasks unique:", len(set(all_t)), "with dupes:", len(all_t))
print("passScores:", re.findall(r'"passScore":\s*(\d+)', t))
