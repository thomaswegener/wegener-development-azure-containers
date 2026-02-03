const bcrypt = require('bcrypt')
bcrypt.compare('qwe123', '$2b$10$51YoA.zT/gVB/SXli1N6pek18PPRkIc0WU8Tb4.msI.zBZ3mV9HDy')
  .then(result => console.log(result))