// import React, {
//     ComponentPropsWithRef,
//     useCallback,
//     useEffect,
//     useState
//   } from 'react'
//   import { EmblaCarouselType } from 'embla-carousel'
  
//   type UseDotButtonType = {
//     selectedIndex: number
//     scrollSnaps: number[]
//     onDotButtonClick: (index: number) => void
//   }
  
//   export const useDotButton = (
//     emblaApi: EmblaCarouselType | undefined
//   ): UseDotButtonType => {
//     const [selectedIndex, setSelectedIndex] = useState(0)
//     const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  
//     const onDotButtonClick = useCallback(
//       (index: number) => {
//         if (!emblaApi) return
//         emblaApi.scrollTo(index)
//       },
//       [emblaApi]
//     )
  
//     const onInit = useCallback((emblaApi: EmblaCarouselType) => {
//       setScrollSnaps(emblaApi.scrollSnapList())
//     }, [])
  
//     const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
//       setSelectedIndex(emblaApi.selectedScrollSnap())
//     }, [])
  
//     useEffect(() => {
//       if (!emblaApi) return
  
//       onInit(emblaApi)
//       onSelect(emblaApi)
//       emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
//     }, [emblaApi, onInit, onSelect])
  
//     return {
//       selectedIndex,
//       scrollSnaps,
//       onDotButtonClick
//     }
//   }
  
//   type PropType = ComponentPropsWithRef<'button'>
  
//   export const DotButton: React.FC<PropType> = (props) => {
//     const { children, ...restProps } = props
  
//     return (
//       <button type="button" {...restProps}>
//         {children}
//       </button>
//     )
//   }
  
import React from 'react'


type PropType = {
  selected: boolean
  index: number
  onClick: () => void
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, index, onClick } = props

  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        {index + 1}
      </button>
    </div>
  )
}
