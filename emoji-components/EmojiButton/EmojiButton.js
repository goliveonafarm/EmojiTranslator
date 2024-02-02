import React from 'react';
import './EmojiButton.css';
import { emojiSlugValue } from '../../../services/emojiConversionService';
import CustomTooltip from '../../ui/CustomTooltip/CustomTooltip';

const EmojiButton = React.memo(({ emojiObject }) => {
    return (
        <CustomTooltip tooltipText={emojiSlugValue(emojiObject)}>
            <span className='emoji-button'>{emojiObject.character}</span>
        </CustomTooltip>
    )
})

export default EmojiButton;