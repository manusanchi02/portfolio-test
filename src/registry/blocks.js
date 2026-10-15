import TextBlock from '../components/blocks/TextBlock.vue'
import ImageBlock from '../components/blocks/ImageBlock.vue'
import ImageGridBlock from '../components/blocks/ImageGridBlock.vue'

export const blockRegistry = {
  text: {
    component: TextBlock,
    getProps: (block) => ({ text: block.text }),
  },
  image: {
    component: ImageBlock,
    getProps: (block) => ({ image: block.image }),
  },
  'image-grid': {
    component: ImageGridBlock,
    getProps: (block) => ({ images: block.images }),
  },
}
