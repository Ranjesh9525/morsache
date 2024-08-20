// import React from 'react'
// import { EmblaOptionsType } from 'embla-carousel'
// import { DotButton, useDotButton } from './ImageGalleryNavigation'
// import useEmblaCarousel from 'embla-carousel-react'

// type PropType = {
//   slides: number[]
//   options?: EmblaOptionsType
// }

// const EmblaCarousel: React.FC<PropType> = (props) => {
//   const { slides, options } = props
//   const [emblaRef, emblaApi] = useEmblaCarousel(options)

//   const { selectedIndex, scrollSnaps, onDotButtonClick } =
//     useDotButton(emblaApi)

//   return (
//     <section className="embla">
//       <div className="embla__viewport" ref={emblaRef}>
//         <div className="embla__container">
//           {slides.map((index) => (
//             <div className="embla__slide" key={index}>
//               <div className="embla__slide__number">{index + 1}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="embla__controls">
//         <div className="embla__dots">
//           {scrollSnaps.map((_, index) => (
//             <DotButton
//               key={index}
//               onClick={() => onDotButtonClick(index)}
//               className={'embla__dot'.concat(
//                 index === selectedIndex ? ' embla__dot--selected' : ''
//               )}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default EmblaCarousel
import React, { useState, useEffect, useCallback } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './ImageGalleryNavigation'
// import './ImageGalleryStyle.css'
type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
