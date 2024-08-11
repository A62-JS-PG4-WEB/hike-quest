import { useState } from "react";
import PropTypes from 'prop-types';
import { createTag } from "../../services/threads.service";

export default function Tags({ thread }) {
  const [tagInput, setTagInput] = useState('');


  const handleCreateTags = async () => {
    if (!tagInput.trim()) {
      alert('Please enter a tag');
      return;
    }

    try {
      await createTag(thread.id, tagInput.trim());
      setTagInput('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <label className="addHashtag" htmlFor="hashtag">Hashtags</label>
      <textarea
        className='commentBox'
        id="hashtag"
        name="hashtag"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)} 
      />
      <small>Separate Hashtags by comma</small> <br />
      <button onClick={handleCreateTags}>Add Tag</button>
    </>
  );
}

Tags.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
