

const rp = require('request-promise')




// todo: these are params
let repos = [];
let org;
let action;
let label;
let newLabel;
let color;
let access_token; // "5f23229ae62a09ee2de73d29060dc80c360bfbed"
let desc;


let argv = require('minimist')(process.argv.slice(2));
parseArgs(argv);



let org_url = `https://api.github.com/repos/${org}`

function isNull(obj) {
    return obj == null;
}

function outputMessageAndUsage(param) {
    console.log('Missing required param(s) ' + param);
    // todo: usage ...
}

function parseArgs(argv) {
    if(argv.repo) {
        if(Array.isArray(argv.repo)) {
            repos = repos.concat(argv.repo);
        }
        else {
            repos.push(argv.repo);
        }
    }
    if(argv.r) {
        if(Array.isArray(argv.r)) {
            repos = repos.concat(argv.r);
        }
        else {
            repos.push(argv.r);
        }
    }
    org = argv.o || argv.org;
    action = argv._[0]; // create | update | delete
    label = argv._[1];
    newLabel = argv._[2];
    color = argv.c || argv.color;
    access_token = argv.token || argv.t;
    desc = argv.desc || argv.d; // not required
}

function checkArgs() {
    switch(true) {
        case repos.length < 1 :
            outputMessageAndUsage('repo');
            return false;
        case isNull(org) :
            outputMessageAndUsage('org');
            return false;
        case isNull(action) :
            outputMessageAndUsage('action');
            return false;
        case isNull(label) :
            outputMessageAndUsage('label');
            return false;
        case isNull(color) :
            outputMessageAndUsage('color');
            return false;
        case isNull(access_token) :
            outputMessageAndUsage('token');
            return false;
        default :
            return true;
    }
}



function createLabel(repo,label,color,description) {
    // console.log('createLabel')
    var options = {
        uri: `${org_url}/${repo}/labels`,
        method: 'POST',
        strictSSL:false,
        json: true,
        headers: {
            'Authorization' : `token ${access_token}`,
            'User-Agent': 'Awesome-Octocat-App'
        },
        body: {
            "name":`${label}`,
            "color":`${color}`,
            "description": `${description}`
        }
    };
    
    return rp(options);
}


function deleteLabel(repo,label) {
    // console.log('deleteLabel')
    var options = {
        uri: `${org_url}/${repo}/labels/${label}`,
        method: 'DELETE',
        strictSSL:false,
        json: true,
        headers: {
            'Authorization' : `token ${access_token}`,
            'User-Agent': 'Awesome-Octocat-App'
        }
    };
    return rp(options);
}

function updateLabel(repo,labelToUpdate,label,color,description) {
    // console.log('editLabel')
    let body = {};
    if(label) {
        body.name = label;
    }
    if(color) {
        body.color = color;
    }
    if(description) {
        body.description = desciption;
    }
    var options = {
        uri: `${org_url}/${repo}/labels/${labelToUpdate}`,
        method: 'PATCH',
        strictSSL:false,
        json: true,
        headers: {
            'Authorization' : `token ${access_token}`,
            'User-Agent': 'Awesome-Octocat-App'
        },
        body: body
    };
    return rp(options);
}



if(checkArgs()) {
    
    repos.forEach(function(repo) {
        console.log([repo,action])
        switch (action) {
            case 'create' :
                return createLabel(repo,label,color,desc);
            case 'update' :
                // todo!!!
               // return updateLabel(repo,label,)
                break;
            case 'delete' :
                return deleteLabel(repo,label);

        }
    })
}

