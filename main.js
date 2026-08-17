import fs from "fs";
import csvParser from "csv-parser";
import PromptSync from "prompt-sync";
import chalk from "chalk";

const prompt = PromptSync();
const timeout = setTimeout;

const result = []
fs.createReadStream("clean_data.csv")
    .pipe(csvParser({headers:["german", "english"]}))
    .on("data", (data) => {
        result.push(data);
    }).on("end", () => main(result));

    
function randomQuestions(arr, limit) {
    const indices = new Set();
    let index = Math.round(Math.random() * arr.length - 1);
    
    while(indices.size !== arr.length) {
        if(!indices.has(index)) {
            indices.add(index);
            index = Math.round(Math.random() * arr.length - 1);
        } else {
            index = Math.round(Math.random() * arr.length - 1);
        }
    }

    return [...indices].slice(0, limit);
}

function main(arr) {
    console.log(chalk.blue.bold("START"));
    console.log(chalk.cyan("----------------------------------------------"));

    console.log(chalk.cyan(`Welcome to the game. Choose how many questions to answer(5 - ${arr.length})`));
    let range = parseInt(prompt("> "));

    const choices = randomQuestions(arr, range);
    let correct = 0, wrong = 0;
    for(let i = 0; i < range; i++) {
        let phrase = arr[choices[i]];
        console.log(chalk.blue(`*** ${phrase["german"]} ***`));
        let answer = prompt("> ");
        if(answer === phrase["english"].replace("é", "e")) {
            console.log(chalk.greenBright("Correct!"));
            correct++;
        } else {
            console.log(chalk.magenta(`Wrong! The correct answer is ${phrase["english"]}.`));
            wrong++;
        }
    }

    timeout(() => {
        console.log(chalk.cyan("------------- RESULTS -----------------------"));
        console.log(chalk.cyan("----------------------------------------------"));
        console.log(`Correct: ${chalk.green(correct)}`);
        console.log(`Wrong: ${chalk.magenta(wrong)}`);
        let pass = wrong < correct ? "Pass" : "Fail";
        console.log(`You ${pass}.`);

        console.log(chalk.cyan("----------------------------------------------"));
        console.log(chalk.blue.bold("END"));
    }, 1000);
}