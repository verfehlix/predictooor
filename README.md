![predictooor_image](https://user-images.githubusercontent.com/7032914/41287684-d98da9f8-6e43-11e8-8d9d-327cc82fba40.png)

# predictooor

![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)

A small tool that analyzes soccer matches and gives a recommendation on which team to pick in a betting game 😎

Data in ```results.csv``` and ```results.xslx``` comes from [Kaggle](https://www.kaggle.com/martj42/international-football-results-from-1872-to-2017/version/5).

## Usage

### Help

```bash
λ node predictooor.js -h

  Usage: predictooor [options]

  Options:

    -a, --team1 [string]  Team One is [team1]
    -b, --team2 [string]  Team Two is [team2]
    -h, --help            output usage information
```

### Example

```bash
λ node predictooor.js -a Germany -b England
```
Result:
```
Looking for matches where Germany (Team 1) played England (Team 2) ...
Found 30 direct matchup(s) between the two teams.

*******************
* DIRECT MATCHUPS *
*******************

01 | 1930-05-10 | Germany VS England | 3:3
02 | 1935-12-04 | England VS Germany | 3:0
03 | 1938-05-14 | Germany VS England | 3:6
04 | 1954-12-01 | England VS Germany | 3:1
05 | 1965-05-12 | Germany VS England | 0:1
06 | 1966-02-23 | England VS Germany | 1:0
07 | 1966-07-30 | England VS Germany | 4:2
08 | 1968-06-01 | Germany VS England | 1:0
09 | 1970-06-14 | England VS Germany | 2:3
10 | 1972-04-29 | England VS Germany | 1:3
11 | 1972-05-13 | Germany VS England | 0:0
12 | 1975-03-12 | England VS Germany | 2:0
13 | 1978-02-22 | Germany VS England | 2:1
14 | 1982-06-29 | Germany VS England | 0:0
15 | 1982-10-13 | England VS Germany | 1:2
16 | 1985-06-12 | England VS Germany | 3:0
17 | 1987-09-09 | Germany VS England | 3:1
18 | 1990-07-04 | Germany VS England | 1:1
19 | 1991-09-11 | England VS Germany | 0:1
20 | 1993-06-19 | England VS Germany | 1:2
21 | 1996-06-26 | Germany VS England | 1:1
22 | 2000-06-17 | England VS Germany | 1:0
23 | 2000-10-07 | England VS Germany | 0:1
24 | 2001-09-01 | Germany VS England | 1:5
25 | 2007-08-22 | England VS Germany | 1:2
26 | 2008-11-19 | Germany VS England | 1:2
27 | 2010-06-27 | Germany VS England | 4:1
28 | 2013-11-19 | England VS Germany | 0:1
29 | 2016-03-26 | Germany VS England | 2:3
30 | 2017-03-22 | Germany VS England | 1:0

Germany (Team 1) has won 13 times (43%).
England (Team 2) has won 12 times (40%).
There were 5 draws (17%).

***********************************
* DIRECT MATCHUPS - LAST 10 YEARS *
***********************************

01 | 2008-11-19 | Germany VS England | 1:2
02 | 2010-06-27 | Germany VS England | 4:1
03 | 2013-11-19 | England VS Germany | 0:1
04 | 2016-03-26 | Germany VS England | 2:3
05 | 2017-03-22 | Germany VS England | 1:0

Germany (Team 1) has won 3 times (60%).
England (Team 2) has won 2 times (40%).
There were 0 draws (0%).

****************************************
* ALL RESULTS: GERMANY - Last 10 years *
****************************************

Germany (Team 1) played 134 matches in the last 10 years.

They have won 89 times (66%).
They have lost 21 times (16%).
There were 24 draws (18%).

****************************************
* ALL RESULTS: ENGLAND - Last 10 years *
****************************************

England (Team 1) played 108 matches in the last 10 years.

They have won 65 times (60%).
They have lost 17 times (16%).
There were 26 draws (24%).

******************
* RECOMMENDATION *
******************

GERMANY
-------
  All-Matchup Wins: 43%
  10y-Matchup Wins: 60%
  10y-Total   Wins: 66%
------------
SCORE:  58%

ENGLAND
-------
  All-Matchup Wins: 40%
  10y-Matchup Wins: 40%
  10y-Total   Wins: 60%
------------
SCORE:  46%

********************************
* RECOMMENDATION: PICK GERMANY *
********************************
```

## Info

Team names that contain a space need to be escaped by ```"``` quotes.

**Example:**

```
λ node predictooor.js -a Russia -b "Saudi Arabia"
```
