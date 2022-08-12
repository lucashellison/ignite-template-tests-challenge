import {createConnection, getConnectionOptions} from 'typeorm';

(async () => {
  const defaultOptions = await getConnectionOptions();
  return await createConnection(
    Object.assign(defaultOptions, {
      host: "database_fin_api",
      database: defaultOptions.database
    })
  );
})();
