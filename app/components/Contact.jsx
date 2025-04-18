import React from 'react'

const Contact = () => {
  return (
    <div>
      <br /><br />
        <div id="contact-email">
            <div id='content' className='flex flex-col content-center items-center'>
              <h1 className='p-1 text-white'>News Letter Updates </h1>
              <p className='text-white'>Get Unique and trendy gift ideas and best offers develivers to your inbox</p>
            </div>
            <div id='email'>
                <form action="" className='flex'>
                    <input type="text"  placeholder='enter your email'/>
                    <button >Submit</button>
                </form>
            </div>
        </div>
        <br /><br />
    </div>
  )
}

export default Contact