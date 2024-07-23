import React, {useEffect, useState} from "react";

interface TextBoxProps {
  onSave: (text: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({onSave}) => {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleSave = () => {
    onSave(text);
    setText('');
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        rows={10}
        cols={50}
        placeholder="Write some text here..."
      />
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default TextBox;