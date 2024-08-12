import { useState } from "react";
import PropTypes from 'prop-types';
import { createTag } from "../../services/threads.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Tags({ thread }) {
  const [tagInput, setTagInput] = useState('');

  const handleCreateTags = async () => {
    if (!tagInput.trim()) {
      toast.warning('Please enter your tag');
      return;
    }

    const tagsArr = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    for (const t of tagsArr) {
      try {
        await createTag(thread.id, t.trim());
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }

    setTagInput('');
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
      <button onClick={handleCreateTags}>Update</button>
    </>
  );
}

Tags.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
