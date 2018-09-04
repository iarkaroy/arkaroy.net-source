const path = require('path');
const fs = require('fs');
const grayMatter = require('gray-matter');
const remark = require('remark');
const html = require('remark-html');
const hljs = require('remark-highlight.js');

const projectsDir = path.resolve(__dirname, 'data/projects');
const articlesDir = path.resolve(__dirname, 'data/articles');

const getFilesInDir = dir => {
    return fs.readdirSync(dir);
};

const getMatter = filepath => {
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const matter = grayMatter(fileContent);
    return matter;
};

const parseMarkdown = md => {
    const parsed = remark().use([html, hljs]).processSync(md);
    return String(parsed);
};

const projectFiles = getFilesInDir(projectsDir);
var projects = [];
projectFiles.forEach(file => {
    const matter = getMatter(path.resolve(projectsDir, file));
    matter.html = parseMarkdown(matter.content);
    projects.push(matter);
});
projects.sort((a, b) => {
    return new Date(b.data.date) - new Date(a.data.date);
});

const articleFiles = getFilesInDir(articlesDir);
var articles = [];
articleFiles.forEach(file => {
    const matter = getMatter(path.resolve(articlesDir, file));
    matter.html = parseMarkdown(matter.content);
    articles.push(matter);
});
articles.sort((a, b) => {
    return new Date(b.data.date) - new Date(a.data.date);
});

const json = { projects, articles };
const file = path.resolve(__dirname, 'data/data.json');
fs.writeFileSync(file, JSON.stringify(json), 'utf8');