const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const productModel = require('./models').product

dotenv.config();

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 3030
const usersStatic = [
  {
    id: 1,
    name: "Alief",
    emaail: "alief123@gmail.com",
    password: "alief123",
    type_data: "premium"
  },
  {
    id: 2,
    name: "Bento",
    emaail: "bento@gmail.com",
    password: "bento123",
    type_data: "basic"
  },
  {
    id: 3,
    name: "Jerry",
    emaail: "jerry@gmail.com",
    password: "jerry123",
    type_data: "premium"
  },
  {
    id: 4,
    name: "Sani",
    emaail: "santi@gmail.com",
    password: "santi123",
    type_data: "basic"
  }
]

const dataUser = [
  {
    user_id: 10,
    email: "alief123@gmail.com",
    password: "alief123",
    role: "premium",
  },
  {
    user_id: 11,
    email: "bento@gmail.com",
    password: "bento123",
    role: "premium",
  },
  {
    user_id: 12,
    email: "jerry@gmail.com",
    password: "jerryf123",
    role: "basic",
  }
]

let checkData = (req, res, next) => {
  // console.log(`Saya Mengecek Data Ini : ${req.body}`)
  next()
}


let checkUser = (req, res, next) => {
  let response = {}
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
      response = {
          status: "ERROR",
          message: "Authorization Failed"
      }
      res.status(401).json(response)
      return
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
    console.log(error)
    if (error) {
        response = {
            status: "ERROR",
            message: error
        }
        res.status(401).json(response)
        return
    }
    req.user = user
    next()
})
}

app.use(checkData)

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/users", (req, res) => {
  res.json(usersStatic)
})

app.get("/users/:id", (req, res) => {
  let response = usersStatic[req.params.id - 1]
  res.json(response)
})

app.post("/users", (req, res) => {
  let response = {
    id: usersStatic.length + 1,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    type_data: req.body.type_data
  }
  usersStatic.push(response)
  res.json(response)
})

app.put("/users/:id", (req, res) => {
  let incomingUpdateDate = {
    id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    type_data: req.body.type_data
  }
  usersStatic[req.params.id - 1] = incomingUpdateDate

  res.json(usersStatic[req.params.id - 1])
})

app.delete("/users/:id", (req, res) => {
  usersStatic.splice(req.params.id - 1, 1)
  res.status(204)
  res.send()
})

 

app.get("/product", async (req, res) => {

  const product = await productModel.findAll();
  const response = {
      status: "SUCCESS",
      message: "Get All product",
      meta: {
          total: product.length
      },
      data: product
  }

  res.status(200).json(response)
  return
})

app.get("/product/:id", async (req, res) => {
  let response = {}
  const product = await productModel.findAll({
      where: {
          id: req.params.id
      }
  });

  if(product.length == 0) {
      response = {
          status: "SUCCESS",
          message: "Data not Found"
      }
  } else {
      response = {
          status: "SUCCESS",
          message: "Get Detail product",
          data: product
      }
  }

  res.status(200).json(response)
  return
})


app.post("/login", (req, res) => {
  let email = req.body.email
  let password = req.body.password

  let response = {}
  let foundUser = {}

  for (let i = 0; i < dataUser.length; i++) {
    if (dataUser[i].email == email) {
      foundUser = dataUser[i]
    }
  }

  if (Object.keys(foundUser).length == 0) {
    response = {
      status: "ERROR",
      message: "User not found"
    }
    res.status(401).json(response)
    return
  }

  if (foundUser.password != password) {
    response = {
      status: "ERROR",
      message: "Kombinasi Email dan Password anda salah"
    }
    res.status(401).json(response)
    return
  }

  let jwt_payload = {
    user_id: foundUser.user_id
  }

  let access_token = jwt.sign(jwt_payload, process.env.TOKEN_SECRET, {expireIn: "1800s"});
  response = {
    status: "SUCCESS",
    access_token: access_token
  }
  res.json(response)
})


app.use(checkUser)

app.post("/product", async (req, res) => {
    let response = {}
    let code = 200
    if(req.body.nama == ""|| req.body.nama == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "nama tidak boleh kosong"
        }

    } 
    if(req.body.descripsi == "" || req.body.descripsi == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "descripsi tidak boleh kosong"
        }
    } 
    if(req.body.harga == "" || req.body.harga == undefined) {
      code = 422
      response = {
          status: "SUCCESS",
          message: "harga tidak boleh kosong"
      }
  }
    if(req.body.kategori_id == "" || req.body.kategori_id == 0 || req.body.kategori_id == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "kategori_id tidak boleh kosong"
        }
    }
    try {
        const newProduct = await productModel.create({
            nama: req.body.nama,
            descripsi: req.body.descripsi,
            harga: req.body.harga,
            kategori_id: req.body.kategori_id
        });
    
        response = {
            status: "SUCCESS",
            message: "Create product",
            data: newProduct
        }
    } catch(error) {
        code = 422
        response = {
            status: "ERROR",
            message: error.parent.sqlMessage
        }
    }
    

    res.status(code).json(response)
    return
})

app.delete("/product/:id", async (req, res) => {
    let response = {}
    let code = 200
    try {
        const newProduct = await productModel.create({
          nama: req.body.nama,
          descripsi: req.body.descripsi,
          harga: req.body.harga,
          kategori_id: req.body.kategori_id
        });
    
        response = {
            status: "SUCCESS",
            message: "Create Product",
            data: newProduct
        }
    } catch(error) {
        code = 422
        response = {
            status: "ERROR",
            message: error.parent.sqlMessage
        }
    }
    

    res.status(code).json(response)
    return
})

app.put("/Product/:id", async (req, res) => {
    let response = {}
    let code = 200
    if(req.body.nama == ""|| req.body.nama == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "nama tidak boleh kosong"
        }

    } 
    if(req.body.descripsi == "" || req.body.descripsi == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "descripsi tidak boleh kosong"
        }
    } 
    if(req.body.harga == "" || req.body.harga == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "harga tidak boleh kosong"
        }
    }
    if(req.body.kategori_id == "" || req.body.kategori_id == 0 || req.body.kategori_id == undefined) {
        code = 422
        response = {
            status: "SUCCESS",
            message: "kategori_id tidak boleh kosong"
        }
    }
    const product = await productModel.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!product) {
        response = {
            status: "SUCCESS",
            message: "Data not Found"
        }
    } else {
      product.nama = req.body.nama
      product.descripsi = req.body.descripsi
      product.harga = req.body.harga
      product.kategori_id = req.body.kategori_id
      product.save()
        response = {
            status: "SUCCESS",
            message: "Update product",
            data: product
        }
    }

    res.status(code).json(response)
    return
})
//
app.listen(port, () => {
  console.log(`This Application Run on Port : ${port}`)
})
