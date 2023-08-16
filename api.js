const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 2000;
const DATA_FILE = path.join(__dirname, 'items.json');

let inventory = [];

// Load inventory data from file
function loadInventory() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        inventory = JSON.parse(data);
    } catch (error) {
        inventory = [];
    }
}

// Save inventory data to file
function saveInventory() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 2), 'utf8');
}

// Load initial data
loadInventory();

const server = http.createServer((req, res) => {

    // GET /items
  if (req.url === '/items' && req.method==='GET'){
    res.writeHead(200, {'Content-Type':'application/json'})
    res.end(JSON.stringify(inventory));
  }

    // GET /items/:id
  else if(req.url.startsWith('/items/') && req.method ==='GET'){
    const itemId = req.url.split('/')[2];
    const item = inventory.find(item => item.id === itemId);
    if(item){
        res.writeHead(200, {'Content-Type':'application/json'})
        res.end(JSON.stringify(item));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Item not found');
    }
  }

    // POST /items
  else if (req.url === '/items' && req.method === 'POST'){
    let requestBody = '';
    req.on('data', ((chunk) =>{
requestBody += chunk.toString();
// console.log(requestBody)
    } )
    )
   
  req.on('end', ()=>{
        const newItem = JSON.parse(requestBody);
        // newItem.id = String(Date.now());
        newItem.id = String(inventory.length + 1);

inventory.push(newItem)
saveInventory()
res.writeHead(201, {'Content-Type':'text/plain'})
res.end('Item created')
     })
  }

// PUT /items/:id
else if(req.url.startsWith('/items/') && req.method === 'PUT'){
    let requestBody = '';
    itemId= req.url.split('/')[2]
    req.on('data', (chunk)=>
    {
        requestBody += chunk.toString();

    })
    req.on('end', ()=>{
        const updatedItem = JSON.parse(requestBody)
        const index = inventory.findIndex(item => item.id === itemId);
       
        // retain its id
      

        if (index !== -1){
              updatedItem.id = itemId;
            inventory[index] = updatedItem 
          
            // newItem.id = itemId;
                saveInventory();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('Item updated');
        }  
             else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end('Item not found');
            }
    })
}

// DELETE /items/:id
else if (req.url.startsWith('/items/') && req.method === 'DELETE') {
    itemId = req.url.split('/')[2];
    const index = inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
        inventory.splice(index, 1);
        saveInventory();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Item deleted');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Item not found');
    }
}


});




server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
