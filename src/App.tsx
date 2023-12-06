import React, { Suspense, lazy } from 'react';
import './style/Global.css';
import Loading from './components/Common/Loading';

const AsyncComponent = lazy(()=> import("./router/router"));

function App() {
  return (
    <div className='w-screen h-screen bg-white'>
      <Suspense fallback={<Loading />}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}

export default App;
