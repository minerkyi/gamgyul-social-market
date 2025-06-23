import React from 'react'
import Header from '../../components/Header'

export default function Products() {

  const handleSave = () => {
    alert('이벤트 동작');
  };

  return (
    <>
      <Header title="상품 목록" type="profile" onClick={handleSave} />
      <section>
        <h2>Products</h2>
        <p>상품 목록</p>
      </section>
    </>
  )
}
