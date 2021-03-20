const faker = require("faker")
const express = require("express")
const app = new express()
const PORT = 8080

const teams = {
  pippo: {
    name: "pippo",
    password: "",
    score: 0,
    killedShips: [],
    firedBullets: 0,
    lastFiredBullet: new Date().getTime()
  }
}
const field = []
const ships = []

const W = process.argv[2] || 6 
const H = process.argv[3] || 6          //scelgo grandezza campo e numero navi
const S = process.argv[4] || 10

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: null,
      hit: false
    })
  } 
  field.push(row)
}

let id = 1
for (let i = 1; i < S+1; i++) {       //inizializzo la creazione delle ship
  const maxHp = faker.random.number({ min: 1, max: 6 })
  const vertical = faker.random.boolean() //vita e disposizione
  //console.log({ vertical, maxHp })

  const ship = {
    id: i,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
    y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
    vertical,
    maxHp,
    curHp: 4,
    alive: true,
    killer: null
  }

  let found = false
  for (let e = 0; e < ship.maxHp; e++) {
    const x = ship.vertical ? ship.x : ship.x + e       //sto piazzando le ships
    const y = ship.vertical ? ship.y + e : ship.y
    if (field[y][x].ship) {
      let found = true
      break
    }
  }

  if (!found) {
    for (let e = 0; e < ship.maxHp; e++) {
      const x = ship.vertical ? ship.x : ship.x + e
      const y = ship.vertical ? ship.y + e : ship.y
      field[y][x].ship = ship
    }
  
    ships.push(ship)
  }
}

app.get("/", ({ query: { format } }, res) => {    //restituisco una cella con x, y, se è colpita, il possibile team e la barca
  const visibleField = field.map(row => row.map(cell => ({ 
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null 
  })))

  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if ( format === "json") {
    res.json({ 
      field: visibleField,
      ships: visibleShipInfo
    })
  } else {
    // html format field
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }
        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          ${visibleField.map(row => `<tr>${row.map(cell => `<td>${cell.ship ? cell.ship.name : ""}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
    `)
  }
})

app.get("/score", ({query: team}, res) => {
  res.send({score: teams[team].score})
})

app.get("/signup", (req, res) => {
  //team password
})
app.get("/fire", ({ query: { x, y, team, password } }, res) => { 
   const Attackers = teams[team]
   let report = ""
   if (new Date().getTime()-Attackers.lastFiredBullet < 1000){
      report = "Stai ricaricando, rilassati e lascia fare ai soldati"    //check sul tempo passato per sparare una pallottola
   }else{    
    Attackers.firedBullets +=1
    Attackers.lastFiredBullet = new Date().getTime()
      if (x>W || y>H || x<0 || y<0 ){
        Attackers.score -= 5 
        report = "Sei riuscito a mancare il mondo, becchi 5 punti di penitenza e un atlante"   //check se ha beccato il tabellone
      }else{
        const UnderAttack = field[y][x]
        if(UnderAttack.hit && UnderAttack.ship===undefined){
          Attackers.score -=2
          report = "Ci hai già sparato, soffri di perdita della memoria a breve termine? nel dubbio -2 punti"  //check era già stata colpita
        }else{
          UnderAttack.hit = true
          if(UnderAttack.ship){
            const AttackedShip = UnderAttack.ship
            AttackedShip.curHp -=1 
            if(AttackedShip.curHp === 0){
              AttackedShip.alive = false
              AttackedShip.killer = Attackers.name
              Attackers.killedShips.push(AttackedShip.id)
              Attackers.score +=3
              report = `NON E' UN ESERCITAZIONE ${AttackedShip.name} E' STATA AFFONDATA`
            }else{
                Attackers.score += 1
                report = "Hai colpito una nave ma a quanto pare di sfuggita"
            }
          }else{
            report = "Peccato, non è esploso nulla"
          }
        }
      }
    }
    res.send({score: Attackers.score, message:report})
  /*
    1. segnare la cella come colpita
    2. segnare eventualmente la nave come colpita (ridurre gli hp e verificare se e' morta)
    3. assegnare il team sia alla cella che alla nave (eventuale)
    4. assicurarsi che il team che chiama l'endpoint non possa chiamarlo per piu' di una volta al secondo (opzionale)
    5. definire un punteggio conseguente all'attacco:
      a. punteggio molto negativo se si spara fuori dal campo
      b. punteggio 0 se acqua
      c. punteggio negativo se spari su casella gia' colpita
      c. punteggio positivo se spari su nave ma non la uccidi
      d. punteggio molto positivo se spari su nave e la uccidi
  */
  res.json({
    x, y, team
  })
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))