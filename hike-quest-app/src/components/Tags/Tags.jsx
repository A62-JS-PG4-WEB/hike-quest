import { useState } from "react";
import PropTypes from 'prop-types';
import { createTag } from "../../services/threads.service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Tags component allows users to add tags to a thread. Tags are entered as a comma-separated list.
 * 
 * @component
 * 
 * @param {Object} props - The component props
 * @param {Object} props.thread - The thread object to which the tags will be added
 * @param {string} props.thread.id - The unique ID of the thread
 * 
 * @returns {JSX.Element} The Tags component
 */
export default function Tags({ thread }) {
  const [tagInput, setTagInput] = useState('');

  /**
   * Handles the creation of tags. Splits the input into an array of tags,
   * trims whitespace, and creates each tag using the createTag service.
   */
  const handleCreateTags = async () => {
    if (!tagInput.trim()) {
      toast.warning('Please enter your tag');
      return;
    }

    const tagsArr = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    for (const t of tagsArr) {
      try {
        const addedTag = await createTag(thread.id, t.trim());
        if (addedTag) {
          toast.success('Tag added successfully.');
        }
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
  /**
   * The thread object containing information about the current thread.
   */
  thread: PropTypes.shape({
    /**
     * The unique ID of the thread.
     */
    id: PropTypes.string.isRequired,
  }).isRequired,
};