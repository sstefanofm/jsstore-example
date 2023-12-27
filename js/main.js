const database = () => {
  /* create database */
  const dbname = 'jsstore'

  const tableTest = {
    name: 'test',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        notNull: true,
        dataType: 'string',
      },
      number: {
        notNull: true,
        dataType: 'number',
      }
    }
  }

  const database = {
    name: dbname,
    tables: [ tableTest ],
  }

  return database
}

const startdb = async (connection, database) => {
  /* start the database */
  const created = await connection.initDb(database)

  if (created)
    console.log('db created')
  else
    console.log('db opened')
}

const insert = async (connection) => {
  const values = [
    {
      name: 'Pepe Argento',
      number: 666,
    },
    {
      name: 'Teemo',
      number: 20,
    },
    {
      name: 'Bad Bany',
      number: 0,
    }
  ]

  const count = await connection.insert({
    into: 'test',
    values,
  })

  return count
}

const select = async (connection) => {
  console.log('select all: ')

  console.log(await connection.select({
    from: 'test'
  }))

  const min = 20, max = 24

  console.log(`select between id: ${ min } - ${ max }`)

  console.log(await connection.select({
    from: 'test',
    where: {
      id: {
        '-': {
          low: min,
          high: max,
        } /* '-' -> between */
      }
    }
  }))
}

const deletex = async (connection) => {
  const count = await connection.remove({
    from: 'test',
    where: {
      id: {
        '>': 50 /* id > value */
      }
    }
  })

  return count
}

const main = async () => {
  const connection = new JsStore.Connection(new Worker('lib/jsstore/jsstore.worker.js'))

  await startdb(connection, database())

  const countInsert = await insert(connection)

  console.log(`inserted ${ countInsert } items`)

  select(connection)

  const countDelete = await deletex(connection)

  console.log(`deleted ${ countDelete } items`)
}

main()
