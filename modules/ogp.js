import sharp from 'sharp'
import TextToSVG from 'text-to-svg'
import TinySegmenter from 'tiny-segmenter'
import path from 'path'
class OgpGenerator {
  constructor(option = {}) {
    const { FONT_PATH, BACKGROUND_IMAGE, WORD_PER_LINE = 12 } = option

    this.textToSVG = TextToSVG.loadSync(FONT_PATH)
    this.segmenter = new TinySegmenter()
    this.bgImg = BACKGROUND_IMAGE
    this.wordPerLine = WORD_PER_LINE
    this.svgOption = {
      x: 0,
      y: 0,
      fontSize: 72,
      anchor: 'top',
      attributes: { fill: 'white', stroke: 'white' },
    }
    this.compositeOption = {
      margin: 60,
    }
  }

  async generate(content) {
    const { outputName, title, subtitle } = content
    try {
      const titleLines = this.splitByLine(title),
        titleBuffers = await this.createTextBuffers(titleLines)
      const titleSVGs = titleBuffers.map((buffer, i) => {
        return {
          input: Buffer.from(buffer),
          left: this.compositeOption.margin,
          top: this.svgOption.fontSize * i + this.compositeOption.margin,
        }
      })

      await sharp(this.bgImg)
        .composite(titleSVGs)
        .resize(1200, 630)
        .jpeg()
        .toFile(outputName)
    } catch (e) {
      throw new Error(e)
    }
  }

  splitByLine(text) {
    const textSplited = this.segmenter.segment(text)

    let wordCount = 0
    const textLines = textSplited
      .reduce((lines, word) => {
        wordCount += word.length
        if (wordCount > this.wordPerLine) {
          wordCount = word.length
          lines += '|'
        }
        return (lines += word)
      }, [])
      .split('|')

    return textLines
  }
  createTextBuffers(textLines) {
    return Promise.all(
      textLines.map(async (text) => {
        const svg = this.textToSVG.getSVG(text, this.svgOption)
        return svg
      })
    )
  }
}

module.exports = function () {
  const ogpG = new OgpGenerator({
    BACKGROUND_IMAGE: path.join(__dirname, '../static/images/back.png'),
    FONT_PATH: path.join(__dirname, '../static/fonts/ラノベ.otf'),
  })
  this.nuxt.hook('content:file:beforeInsert', async (document) => {
    const { title = '無名の記事' } = document
    const fileName = title + '.jpg'
    try {
      await ogpG.generate({
        title,
        outputName: path.join(__dirname, '../static/images/', fileName),
      })
      document.ogpImageName = fileName
    } catch (e) {
      throw new Error(e)
    }
  })
}
