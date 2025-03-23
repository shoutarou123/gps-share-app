import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function User() {
  const navigate = useNavigate()
  const { id } = useParams(); // URLのid取得
  
  
  useEffect(() => {
    const id = "hoge";
   
      navigate(`/user/${id}`)
    
  },[id, navigate] );
  
  return <div>User ID: {id}</div>
}
