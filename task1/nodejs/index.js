const neo4j = require('neo4j-driver');
const uri = 'bolt://localhost:7687'

const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "1"));

const session = driver.session();
const personName = 'Admin'

const transaction = session.beginTransaction();

const start = 'Вокзал';
const end = 'Парк Херсонська Фортеця'

const cqlShortestPath = `
    MATCH path = shortestPath((a:Stop {name: '${start}'})-[:PATH*1..15]-(b:Stop {name: '${end}'}))
    RETURN path
`

transaction.run(cqlShortestPath)
.then(res => {
    
    res.records.map(record => {
        let length = 0;

        console.log('==== Путь ====');
        record.get('path').segments.forEach(element => {
            length++;
            console.log(element.start.properties.name);
        });
        length++;
        console.log(record.get('path').end.properties.name)

        console.log('==== Длина ====');

        console.log(length);

    })
}).then(()=>{
    session.close();
    process.exit()
})