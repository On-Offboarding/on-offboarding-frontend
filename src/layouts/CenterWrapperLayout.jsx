import React from 'react'
import { Outlet } from 'react-router-dom'

function CenterWrapperLayout() {
  return (
    <div className='center-wrapper'>
      <div className='center-content'>
        <Outlet />
      </div>
    </div>

  )
}

export default CenterWrapperLayout