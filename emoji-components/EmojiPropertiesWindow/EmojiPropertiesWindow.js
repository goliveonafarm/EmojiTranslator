import { Row, Col } from 'react-bootstrap';
import EmojiButton from '../EmojiButton/EmojiButton.js';
import { findEmoji, convertEmojiIntoCodeByteString } from '../../../services/emojiConversionService.js';
import './EmojiPropertiesWindow.css';

const EmojiPropertiesWindow = ({ emoji, emojiList, handleClick }) => {
    const classNames = `bg-dark text-light border border-success rounded emojiWindow emojiWindow`;

    if (emoji === null) return (<Row className={classNames}></Row>);

    let emojiArray = Array.from(emoji.character)
    let codeBytes = ``;
    emojiArray.forEach(element => {
        codeBytes += `${convertEmojiIntoCodeByteString(element)} `
    })

    return (
        <Row className={classNames} readOnly>
            <Row>
                <Col>{`Emoji: ${emoji.character}`}</Col>
            </Row>
            <Row>
                <Col>
                    {`Length: ${emoji.character.length}`}
                </Col>
            </Row>
            <Row>
                <Col onClick={handleClick}>
                    {`Elements: `}{
                        emojiArray.map((emoji, index) => {
                            const match = findEmoji(emoji, emojiList)
                            return match ? (
                                <EmojiButton
                                    emojiObject={match}
                                    key={`emoji-window-element-btn-${index}`}
                                />) :
                                (
                                    <span key={`emoji-window-element-btn-${index}`}> {`U+${emoji.codePointAt(0).toString(16).toUpperCase()}`}  </span>
                                )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    {`Slug: ${emoji.slug}`}
                </Col>
            </Row>
            <Row>
                <Col>
                    {`UTF-16 code units: ${codeBytes}`}
                </Col>
            </Row>
            <Row>
                <Col onClick={handleClick}>
                    {`Variants: `}{
                        emoji.variants && emoji.variants.map((variant, index) => {
                            const match = findEmoji(variant.character, emojiList)
                            return match ? (
                                <EmojiButton
                                    emojiObject={match}
                                    key={`emojiWindowVariantBtn-${index}`}
                                />
                            ) : null;
                        })
                    }
                </Col>
            </Row>


        </Row >
    )
}

export default EmojiPropertiesWindow;