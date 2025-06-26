import styles from './ProfileStore.module.css';

// 개별상품 표시하는 자식 컴포넌트
function ProductItem({ image, name, price, onProductClick }) {
  //숫자에 콤마가 포함된 가격 문자열로 변환하는 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <li
      className={styles.productItem}
      onClick={() => {
        onProductClick();
      }}
    >
      <div className={styles.productImageWrapper}>
        <img
          src={image}
          alt={`${name} 상품 이미지`}
          className={styles.productImage}
        />
      </div>
      <p className={styles.productName}>{name}</p>
      <p className={styles.productPrice}>{formatPrice(price)}원</p>
    </li>
  );
}

// 메인컴포넌트 : 상품 전체 렌더링
function ProfileStore({ products, onProductClick }) {
  // 비어있으면 아무것도 렌더링 하지 않음
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={styles.storeContainer}>
      <h2 className={styles.storeTitle}>판매 중인 상품</h2>
      <ul className={styles.productList}>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            name={product.itemName}
            price={product.price}
            image={product.itemImage}
            onProductClick={() => onProductClick(product)}
          />
        ))}
      </ul>
    </section>
  );
}

export default ProfileStore;
