import React, { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import Home from 'features/Home';

const App: FC = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
  ]);

  return (
    <>
      {routes}
    </>
  );
}

export default App;
