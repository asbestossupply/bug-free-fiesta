const app = require('./app');

const arg = require('arg')
const args = arg({
    '--port': Number,
  
    // aliases
    '-p': '--port',
  });
const port = args['--port'] || 3000

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});