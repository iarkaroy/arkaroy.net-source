const path = require('path');
const fs = require('fs');
const grayMatter = require('gray-matter');

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

const sortProjects = projects => {
    projects.sort((a, b) => {
        return new Date(b.data.date) - new Date(a.data.date);
    });
};

readProjects().then(projects => {
    sortProjects(projects);
    const json = { projects };
    const file = path.resolve(__dirname, 'data/data.json');
    fs.writeFileSync(file, JSON.stringify(json), 'utf8');
});