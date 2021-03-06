// imports
const program = require('commander')
const csv = require('csvtojson')

// path to soccer results data
const csvFilePath = 'results.csv'

// setup command line argument parsing
program
  .option('-a, --team1 [string]', 'Team One is [team1]')
  .option('-b, --team2 [string]', 'Team Two is [team2]')
  .parse(process.argv)

// abort if no teams were specified
if(!program.team1 || !program.team2) {
    console.log("\nPlease specify team1 and team2. For more information, use the -h flag.")
    return
}

// run "analysis"
try{
    console.log("\nLooking for matches where %s (Team 1) played %s (Team 2) ...", program.team1, program.team2)
    run()
} catch(e) {
    console.error(e)
}

// "analysis" function
async function run(){

    // get all results from csv
    const allResults = await csv().fromFile(csvFilePath)

    /***************************
     * Analyze direct matchups *
     ***************************/

    // relevant results include only matchups between team1 and team2 (sort by date)
    const relevantResults = allResults.filter(element => {
        return (
            (element.home_team === program.team1 && element.away_team === program.team2) ||
            (element.home_team === program.team2 && element.away_team === program.team1)
        )
    }).sort((e1, e2) => {
        e1 = e1.date.split('-')
        e2 = e2.date.split('-')
        return e1[0] - e2[0] || e1[1] - e2[1] || e1[2] - e2[2]
    })
    
    printHeadline("DIRECT MATCHUPS")

    let team1wins
    let team2wins
    let team1winsPercentage
    let team2winsPercentage
    let drawsPercentage
    // if no matchups were found, abort
    if(relevantResults.length === 0) {
        console.log("Found NO direct matchup(s) between the two teams.")
    } else {
        console.log("Found %i direct matchup(s) between the two teams.", relevantResults.length)

        
        // print relevant results
        printResultsTable(relevantResults)
        
        // analyze all matches
        team1wins = relevantResults.filter(element => {
            return (
                (element.home_team === program.team1 && element.home_ft > element.away_ft) ||
                (element.away_team === program.team1 && element.away_ft > element.home_ft)
            )
        })

        team2wins = relevantResults.filter(element => {
            return (
                (element.home_team === program.team2 && element.home_ft > element.away_ft) ||
                (element.away_team === program.team2 && element.away_ft > element.home_ft)
            )
        })

        team1winsPercentage = ((team1wins.length / relevantResults.length)*100).toFixed(0)
        team2winsPercentage = ((team2wins.length / relevantResults.length)*100).toFixed(0)
        drawsPercentage = (((relevantResults.length - team1wins.length - team2wins.length) / relevantResults.length)*100).toFixed(0)

        console.log("\n%s (Team 1) has won %i times (%s%).", program.team1, team1wins.length, team1winsPercentage)
        console.log("%s (Team 2) has won %i times (%s%).", program.team2, team2wins.length, team2winsPercentage)
        console.log("There were %i draws (%s%).", relevantResults.length - team1wins.length - team2wins.length, drawsPercentage)
    }

    /************************************************
     * Analyze direct matchups in the last 10 years *
     ************************************************/

    printHeadline("DIRECT MATCHUPS - LAST 10 YEARS")

    // analyze last 10 years
    const totalMatchesLast10Years = relevantResults.filter(element => {
        return element.date.split("-")[0] >= (new Date().getFullYear() - 10)
    })

    let team1winsLast10YearsPercentage
    let team2winsLast10YearsPercentage
    let drawsLast10YearsPercentage

    if(totalMatchesLast10Years.length === 0) {
        console.log("There were no matches in the last 10 years.")
    } else {
        printResultsTable(totalMatchesLast10Years)
        
        const team1winsLast10Years = team1wins.filter(element => {
            return element.date.split("-")[0] >= (new Date().getFullYear() - 10)
        })

        const team2winsLast10Years = team2wins.filter(element => {
            return element.date.split("-")[0] >= (new Date().getFullYear() - 10)
        })

        team1winsLast10YearsPercentage = ((team1winsLast10Years.length / totalMatchesLast10Years.length)*100).toFixed(0)
        team2winsLast10YearsPercentage = ((team2winsLast10Years.length / totalMatchesLast10Years.length)*100).toFixed(0)
        drawsLast10YearsPercentage = (((totalMatchesLast10Years.length - team1winsLast10Years.length - team2winsLast10Years.length) / totalMatchesLast10Years.length)*100).toFixed(0)

        console.log("\n%s (Team 1) has won %i times (%s%).", program.team1, team1winsLast10Years.length, team1winsLast10YearsPercentage)
        console.log("%s (Team 2) has won %i times (%s%).", program.team2, team2winsLast10Years.length, team2winsLast10YearsPercentage)
        console.log("There were %i draws (%s%).", totalMatchesLast10Years.length - team1winsLast10Years.length - team2winsLast10Years.length, drawsLast10YearsPercentage)
    }

    /**********************************
     * Analyze ALL matchups of Team 1 *
     **********************************/

    printHeadline("ALL RESULTS: " + program.team1.toUpperCase() + " - Last 10 years")

    const team1AllResultsLast10Years = allResults.filter(element => {
        return (
            (element.home_team === program.team1 || element.away_team === program.team1) &&
            (element.date.split("-")[0] >= (new Date().getFullYear() - 10))
        )
    }).sort((e1, e2) => {
        e1 = e1.date.split('-')
        e2 = e2.date.split('-')
        return e1[0] - e2[0] || e1[1] - e2[1] || e1[2] - e2[2]
    })

    console.log("%s (Team 1) played %i matches in the last 10 years.\n", program.team1, team1AllResultsLast10Years.length)

    const team1AllWinsLast10Years = team1AllResultsLast10Years.filter(element => {
        return (
            (element.home_team === program.team1 && element.home_ft > element.away_ft) ||
            (element.away_team === program.team1 && element.away_ft > element.home_ft)
        )
    })

    const team1AllLossesLast10Years = team1AllResultsLast10Years.filter(element => {
        return (
            (element.home_team === program.team1 && element.home_ft < element.away_ft) ||
            (element.away_team === program.team1 && element.away_ft < element.home_ft)
        )
    })

    const team1AllWinsLast10YearsPercentage = ((team1AllWinsLast10Years.length / team1AllResultsLast10Years.length)*100).toFixed(0)
    const team1AllLossesLast10YearsPercentage = ((team1AllLossesLast10Years.length / team1AllResultsLast10Years.length)*100).toFixed(0)
    const team1AllDrawsLast10YearsPercentage = (((team1AllResultsLast10Years.length - team1AllWinsLast10Years.length - team1AllLossesLast10Years.length) / team1AllResultsLast10Years.length)*100).toFixed(0)

    console.log("They have won %i times (%s%).", team1AllWinsLast10Years.length, team1AllWinsLast10YearsPercentage)
    console.log("They have lost %i times (%s%).", team1AllLossesLast10Years.length, team1AllLossesLast10YearsPercentage)
    console.log("There were %i draws (%s%).", team1AllResultsLast10Years.length - team1AllWinsLast10Years.length - team1AllLossesLast10Years.length, team1AllDrawsLast10YearsPercentage)

    /**********************************
     * Analyze ALL matchups of Team 2 *
     **********************************/

    printHeadline("ALL RESULTS: " + program.team2.toUpperCase() + " - Last 10 years")

    const team2AllResultsLast10Years = allResults.filter(element => {
        return (
            (element.home_team === program.team2 || element.away_team === program.team2) &&
            (element.date.split("-")[0] >= (new Date().getFullYear() - 10))
        )
    }).sort((e1, e2) => {
        e1 = e1.date.split('-')
        e2 = e2.date.split('-')
        return e1[0] - e2[0] || e1[1] - e2[1] || e1[2] - e2[2]
    })

    console.log("%s (Team 2) played %i matches in the last 10 years.\n", program.team2, team2AllResultsLast10Years.length)

    const team2AllWinsLast10Years = team2AllResultsLast10Years.filter(element => {
        return (
            (element.home_team === program.team2 && element.home_ft > element.away_ft) ||
            (element.away_team === program.team2 && element.away_ft > element.home_ft)
        )
    })

    const team2AllLossesLast10Years = team2AllResultsLast10Years.filter(element => {
        return (
            (element.home_team === program.team2 && element.home_ft < element.away_ft) ||
            (element.away_team === program.team2 && element.away_ft < element.home_ft)
        )
    })

    const team2AllWinsLast10YearsPercentage = ((team2AllWinsLast10Years.length / team2AllResultsLast10Years.length)*100).toFixed(0)
    const team2AllLossesLast10YearsPercentage = ((team2AllLossesLast10Years.length / team2AllResultsLast10Years.length)*100).toFixed(0)
    const team2AllDrawsLast10YearsPercentage = (((team2AllResultsLast10Years.length - team2AllWinsLast10Years.length - team2AllLossesLast10Years.length) / team2AllResultsLast10Years.length)*100).toFixed(0)

    console.log("They have won %i times (%s%).", team2AllWinsLast10Years.length, team2AllWinsLast10YearsPercentage)
    console.log("They have lost %i times (%s%).", team2AllLossesLast10Years.length, team2AllLossesLast10YearsPercentage)
    console.log("There were %i draws (%s%).", team2AllResultsLast10Years.length - team2AllWinsLast10Years.length - team2AllLossesLast10Years.length, team2AllDrawsLast10YearsPercentage)

    /******************
     * Recommendation *
     ******************/

    printHeadline("RECOMMENDATION")

    console.log(program.team1.toUpperCase())
    console.log("-".repeat(program.team1.length))
    if(team1winsPercentage){   
        console.log("  All-Matchup Wins:", team1winsPercentage + "%")
    }
    if(totalMatchesLast10Years.length !== 0){   
        console.log("  10y-Matchup Wins:", team1winsLast10YearsPercentage + "%")
    }
    console.log("  10y-Total   Wins:", team1AllWinsLast10YearsPercentage + "%")
    const team1score = calcSecretSauceRecommendationScore(team1winsPercentage, team1winsLast10YearsPercentage, team1AllWinsLast10YearsPercentage)
    console.log("------------")
    console.log("SCORE: ", (team1score).toFixed(0) + "%")

    console.log("\n" + program.team2.toUpperCase())
    console.log("-".repeat(program.team2.length))
    if(team2winsPercentage){   
        console.log("  All-Matchup Wins:", team2winsPercentage + "%")
    }
    if(totalMatchesLast10Years.length !== 0){   
        console.log("  10y-Matchup Wins:", team2winsLast10YearsPercentage + "%")
    }
    console.log("  10y-Total   Wins:", team2AllWinsLast10YearsPercentage + "%")
    const team2score = calcSecretSauceRecommendationScore(team2winsPercentage, team2winsLast10YearsPercentage, team2AllWinsLast10YearsPercentage)
    console.log("------------")
    console.log("SCORE: ", (team2score).toFixed(0) + "%")

    const recommededTeam = team1score > team2score ? program.team1 : program.team2

    printHeadline("RECOMMENDATION: PICK " + recommededTeam.toUpperCase())
}

// super secrect sauce recommendation score engine powered by big data distributed 
// cloud computing on the blockchain enabling industry 4.0-grade soccer recommendations
function calcSecretSauceRecommendationScore(allMatchupWins, y10MatchupWins, y10TotalWins) {
    // no matchups at all available
    if(!allMatchupWins){
        const weighty10Total = 1

        return parseInt (y10TotalWins) * weighty10Total
    }
    // no 10yMatchupWins available
    else if(!y10MatchupWins) {
        const weightAllMatchups = 0.3
        const weighty10Total = 0.7

        return parseInt(allMatchupWins) * weightAllMatchups 
             + parseInt(y10TotalWins) * weighty10Total
    }
    // 10yMatchupWins are available
    else {
        const weightAllMatchups = 0.2
        const weighty10Matchups = 0.5
        const weighty10Total = 0.3

        return parseInt(allMatchupWins) * weightAllMatchups 
             + parseInt(y10MatchupWins) * weighty10Matchups
             + parseInt(y10TotalWins) * weighty10Total
    }
}

// prints results tablularly
function printResultsTable(results){
    results.forEach((element, i) => {
        let matchNr = i + 1 + ""
        if(i+1 < 10) matchNr = "0" + matchNr
        const result = element.home_ft + ":" + element.away_ft
        console.log(matchNr, "|", element.date, "|", element.home_team, "VS", element.away_team, "|", result)
    })
}

// prints big text with border (cool)
function printHeadline(string){
    console.log("\n**" + "*".repeat(string.length) + "**")
    console.log("* " + string + " *")
    console.log("**" + "*".repeat(string.length) + "**\n")
}