const path = require('path');
const fs = require('fs');
const grayMatter = require('gray-matter');
const remark = require('remark');
const html = require('remark-html');

const readProjects = () => {
    return new Promise((resolve, reject) => {
        const dirPath = path.resolve(__dirname, 'data/projects');
        var projects = [];
        fs.readdir(dirPath, (err, files) => {
            files.forEach(file => {
                const fileContent = fs.readFileSync(path.resolve(dirPath, file), 'utf8');
                const matter = grayMatter(fileContent);
                projects.push(matter);
            });
            resolve(projects);
        });
    });
};

const htmlify = str => {
    return new Promise((resolve, reject) => {
        remark().use(html).process(str, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(String(data));
        });
    });
}

const parseProjectContents = async (projects) => {
    for (let i = 0; i < projects.length; ++i) {
        projects[i].html = await htmlify(projects[i].content);
    }
    return projects;
};

const sortProjects = projects => {
    projects.sort((a, b) => {
        return new Date(b.data.date) - new Date(a.data.date);
    });
};

readProjects()
    .then(parseProjectContents)
    .then(projects => {
        sortProjects(projects);
        const json = { projects };
        const file = path.resolve(__dirname, 'data/data.json');
        fs.writeFileSync(file, JSON.stringify(json), 'utf8');
    });