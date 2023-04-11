import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';
import data from './data';
function App() {

  const [displayIndex, setDisplayIndex] = useState(0);

  // Alternatively, 也可以不使用 useEffect 执行检查，
    // 而使用 三个 function 来 作为 displayIndex 的 setter;

    // const handlePrev = () => {
    //   const number = displayIndex - 1;
    //   setDisplayIndex(checkNumber(number));
    // }
  
    // const handleNext = () => {
    //   const number = displayIndex + 1;
    //   setDisplayIndex(checkNumber(number));
    // }

  // 亦可在 return 内设置 inline function + 1 - 1，
    // 并将 check 过程简化到 useEffect 内。
    // const checkNumber = (number) => {
    //   if (number > data.length - 1) {
    //     return 0
    //   } else if (number < 0) {
    //     return data.length - 1;
    //   } else {
    //     return number
    //   }
    // }

  // 用 inline function + useEffect 版本的 checkNumber，一步到位设置 limitless loop！
  useEffect(() => {
    const limit = data.length - 1;
    if (displayIndex > limit) {
      setDisplayIndex(0);
    } 
    if (displayIndex < 0) {
      setDisplayIndex(limit);
    }
  },[data,displayIndex]);

  // 增加一个新的 useEffect，用于设置 setInterval！
    // 这个 setInterval 如果没有 clear function，会导致
    // 每一次 displayIndex 发生变化，每一次更改 activeSlide，
    // 都重设一次 timer，timer 间隔会越来越短，最终开始快速重设。

    // 因此应该设置一个 useEffect 的 return，
    // return 的 callBack 用于 clear up setInterval,
    // 每次启动一个 timer，都重新设置一次 timer，不再叠加 timer.

    // 具体可见 useEffect cleanup function 一节。

  useEffect(() => {
    const autoInterval = setInterval(() => {
      setDisplayIndex(displayIndex + 1)
    }, 2000);
    return () => {
      clearInterval(autoInterval);
    }
  },[data,displayIndex])

  return (<section className='section'>
    <div className='title'>
      <h2>
        <span>/</span>
        "Reviews"
      </h2>
    </div>
    <div className='section-center'>
    {data.map((item, index) => {
      const {id, image, title, name, quote} = item;
      // 轮播配置
      // 默认堆放在 nextSlide，
        // 除非 index = displayIndex 则 class 为 active；
        // 前一个的 class 设置为 lastSlide.
      
      let position = 'nextSlide';
      if (index === displayIndex) {
        position = 'activeSlide';
        // 双条件：显示前一个项目，并在初始状态下，在左侧显示最后一个项目
      } else if (index === displayIndex - 1 || (displayIndex === 0 && index === data.length - 1))
      {
        position = 'lastSlide'
      }
      return (
      <article key={id} className={position}>
        <img src={image} alt={name} className='person-img' />
        <h4>{name}</h4>
        <p className='title'>{title}</p>
        <p className='text'>{quote}</p>
        <FaQuoteRight className='icon'/>
      </article>
    )})}
      <button className='prev' onClick={() => setDisplayIndex(displayIndex - 1)}><FiChevronLeft /></button>
      <button className='next' onClick={() => setDisplayIndex(displayIndex + 1)}><FiChevronRight /></button>
    </div>

  </section>);
}

export default App;

// 两大问题：
  // 1. 无法实现滑动效果。
  // 2. setTimeOut 不起作用，只能进行第一次轮播。

// 根据参考答案做出改进：
  // 首先，为了实现滑动，不应一次仅显示一个 item，
    // 而应全部显示，用 CSS 调整 active 状态，设置每个 slide 的横坐标。
  // 这个滑动功能的本质，是把不需要用的 item 滑动到界外，设置一个 
    // transform: translateX(100%); 或 transform: translateX(-100%);

// 当将所有 <article> 都装进 <div className='section'> 后，页面将出现重叠。
  // 此刻打开 CSS 并：
    // 1. 将 article 的 style comment out like this:
      // article {
      //   /* position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%; */
      //   /* opacity: 0; */
      //   transition: var(--transition);
      // }
      // 此刻，article 使用的是 .section-center 中的 position: flex.

      // 如果调整回之前的 absolute，并将文件尾部的几个 class 列出，
        // 并在 DOM 中，对某一个 <article> 添加一个 class，则立即可以看到滑动。
        // 每次循环发生，activeSlide 均居中，lastSlide 居左，其余居右。
    // 2. 利用 CSS 设置可见性：
      // .section-center 中的 overflow hidden，确保了不在尺寸框内的部分不显示；
        // opacity: 1 确保了只有 activeSlide 予以不透明展示。
      // 布局变为：
        // prevSlide activeSlide nextSlide nextSlide
    
    // 在 App.js 中设置：<article> 在什么情况下采用哪个 class。