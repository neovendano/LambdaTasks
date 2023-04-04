import inquirer from 'inquirer';
import fs from 'fs';

function userToJson(dbName, dbGender, dbAge){
    let dbObject = {
        name: dbName,
        gender: dbGender,
        age: dbAge
    };
    return dbObject;
}

let isDial = true;

while (isDial)  await inquirer
    .prompt([
        {
            name: 'name',
            message: 'Enter the user`s name. To cancel, press ENTER: ',
            type: 'input',
        },
    ])
    .then(async (name) => {
        if (name.name === '') {
            isDial = false;
            await inquirer
                .prompt([
                    {
                        name: 'search',
                        message: 'Would you to search values in DB? ',
                        type: 'confirm',
                    },
                ])
                .then(async (answers) => {
                    if(answers.search){
                        try {
                            let originDB = JSON.parse(fs.readFileSync('test.txt', 'utf8'));
                            for (let user in originDB.users) console.log(originDB.users[user]);
                            await inquirer
                                .prompt([
                                    {
                                        name: 'searchName',
                                        message: 'Enter name: ',
                                        type: 'input',
                                    },
                                ])
                                .then((answers) => {
                                    for (let user in originDB.users) {
                                        if (answers.searchName.toLowerCase() === originDB.users[user].name.toLowerCase()){
                                            console.log(originDB.users[user]);
                                        }
                                    }
                                });
                        }
                        catch(err){
                            console.log('DB is empty(')
                        }
                    }
                });
        }
        else if (name.name !== '') {
            await inquirer
                .prompt([
                    {
                        name: 'gender',
                        message: 'Enter gender: ',
                        type: 'list',
                        choices: ['male', 'female', 'nonbin', 'hambuhbuh'],
                    },
                    {
                        name: 'age',
                        message: 'Enter age: ',
                        type: 'number',
                    }
                ])
                .then((answers) => {
                    console.log(name.name);
                    try {
                        let originDB = JSON.parse(fs.readFileSync('test.txt', 'utf8'));
                        originDB.users.push(userToJson(name.name, answers.gender, answers.age));
                        fs.writeFileSync('test.txt', JSON.stringify(originDB));
                    }
                    catch(err){
                        let newDB = { users : []};
                        newDB.users.push(userToJson(name.name, answers.gender, answers.age));
                        fs.writeFileSync('test.txt', JSON.stringify(newDB));
                    }
                })
        }
    });