import { useState, useMemo, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import allEmojisJson from '../Data/emojis.json';
import supportedEmojisJson from '../Data/supportedEmojis.json';
import TextInput from '../components/form-elements/TextInput/TextInput';
import { useDebounce } from '../hooks/useDebounce';
import { decodeInput, findEmoji, addEmojiAndVariantsToList } from '../services/emojiConversionService';
import EmojiButton from '../components/emoji-components/EmojiButton/EmojiButton';
import NumberResultsDropDownBtn from '../components/form-elements/NumberResultsDropDownBtn/NumberResultsDropDown';
import PaginationNavigator from '../components/form-elements/PaginationNavigator/PaginationNavigator';
import EmojiPropertiesWindow from '../components/emoji-components/EmojiPropertiesWindow/EmojiPropertiesWindow';
import usePagination from '../hooks/usePagination';

const EmojiTranslatorPage = () => {
    const [originalMessage, setOriginalMessage] = useState('');
    const [decodedMessage, setDecodedMessage] = useState('');
    const [emojiInput, setEmojiInput] = useState(null);

    const supportedEmojisArray = useMemo(() => {
        return supportedEmojisJson.map(emoji => emoji);
    }, []);

    {/* Not for emoji keyboard*/ }
    const allEmojisArray = useMemo(() => {
        let emojiArray = [];
        allEmojisJson.forEach(emoji => {
            addEmojiAndVariantsToList(emoji, emojiArray);
        });
        return emojiArray;
    }, []);

    const [itemsPerPage, setItemsPerPage] = useState('300');
    const { currentPage, paginate, currentItems, pageCount } = usePagination(supportedEmojisArray, itemsPerPage);

    const debouncedOriginalMessage = useDebounce(originalMessage, 100);

    useEffect(() => {
        const translatedArray = decodeInput(debouncedOriginalMessage, allEmojisArray);
        setDecodedMessage(translatedArray);

    }, [debouncedOriginalMessage, allEmojisArray]);

    const handleTextChange = (text) => {
        setOriginalMessage(text);
    };

    const handleEmojiInputChange = (emoji) => {
        if (emoji) {
            let match = findEmoji(emoji, allEmojisArray);
            if (match) {
                setEmojiInput({ ...match });
            } else {
                setEmojiInput(null);
            }
        } else {
            setEmojiInput(null);
        }
    };

    const handleClickEmoji = (e) => {
        const emojiText = e.target.textContent;
        let match = findEmoji(emojiText, allEmojisArray);
        if (match) setEmojiInput({ ...match });
    };

    const onChangeItemsPerPage = (paginateSettingObj, newItemsPerPage) => {
        //can change this later to update pagination settings to local storagef
        return;
    };

    const emojiButtons = useMemo(() => (
        currentItems.map((emoji) => (
            <Col style={{ padding: 0 }} key={emoji.slug}>
                <EmojiButton emojiObject={emoji} />
            </Col>
        ))
    ), [currentItems]);

    return (
        <div>
            <Row onClick={handleClickEmoji}>
                <h1>Emoji keyboard and translator</h1>
                <p>Try decoding this sentence -</p>
                <p>Located in <EmojiButton emojiObject={supportedEmojisArray[2419]} /><EmojiButton emojiObject={supportedEmojisArray[3313]} />, I'm <EmojiButton emojiObject={supportedEmojisArray[2790]} /> for a <EmojiButton emojiObject={supportedEmojisArray[3037]} /> and <EmojiButton emojiObject={supportedEmojisArray[2771]} /> role where I can <EmojiButton emojiObject={supportedEmojisArray[2852]} /> my skills. <EmojiButton emojiObject={supportedEmojisArray[2966]} /> for work and <EmojiButton emojiObject={supportedEmojisArray[2540]} /> to start ASAP! I'm all about bringing <EmojiButton emojiObject={supportedEmojisArray[2793]} /> and <EmojiButton emojiObject={supportedEmojisArray[2644]} /> to my work.</p>
                <div>
                    <TextInput
                        name='Enter message'
                        value={originalMessage}
                        placeholder={'Enter text here'}
                        onTextChange={handleTextChange}
                    />
                </div>
                <div>
                    <p>Message:</p>
                    <p className="" style={{ height: '75px', overflow: 'auto' }}>{decodedMessage}</p>
                </div>
                <hr />
            </Row>
            <Row className='align-items-center'>
                <Col xs={12} sm={'auto'} md={'auto'} onClick={handleClickEmoji}>
                Click or enter any emoji -
                    <EmojiButton emojiObject={supportedEmojisArray[1112]} />
                </Col>
                <Col xs={12} sm={3} md={2} lg={3}>
                    <TextInput
                        name='Enter emoji'
                        value={emojiInput ? emojiInput.character : ''}
                        placeholder={'Enter emoji'}
                        onTextChange={handleEmojiInputChange}
                    />
                </Col>
            </Row>
            <EmojiPropertiesWindow
                emoji={emojiInput}
                emojiList={allEmojisArray}
                handleClick={handleClickEmoji}
            />
            <Row onClick={handleClickEmoji}
                className='pb-3'>
                {emojiButtons}
            </Row>
            <Row>
                <Col>
                    <PaginationNavigator
                        pageCount={pageCount}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </Col>
                <Col>
                    <NumberResultsDropDownBtn
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        setCurrentPage={paginate}
                        onChangeItemsPerPage={onChangeItemsPerPage}
                        resultsPerPage={[300, 500, 1000, 4000]}
                        variant={"dark"}
                    />
                </Col>
            </Row>
        </div >
    )
}

export default EmojiTranslatorPage;

