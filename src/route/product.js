// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(
      10000 + Math.random() * (99999 + 1 - 10000),
    )
    this.createDate = new Date().toISOString()
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      product.name = data.name
      product.price = data.price
      product.description = data.description
      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  if (
    product.name.length > 0 &&
    product.price.length > 0 &&
    product.description.length > 0
  ) {
    Product.add(product)
    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно додано',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Усі дані повинні бути введені',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-edit', function (req, res) {
  const product = req.body
  const result = Product.updateById(
    Number(product.id),
    product,
  )

  if (result) {
    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно оновлено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const result = Product.deleteById(Number(id))
  if (result) {
    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно видалено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
