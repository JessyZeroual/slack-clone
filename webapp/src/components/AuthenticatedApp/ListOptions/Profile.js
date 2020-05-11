import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import { updateAvatarProfile } from '../../../controllers/user';
import { ButtonUpload } from './ListOptions.styled';

const Profile = ({ setIsOpenModal, isOpenModal, currentUser }) => {
  let username;
  let uploadInput;

  const uploadAvatar = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', uploadInput.files[0]);
    await updateAvatarProfile(formData);
  };

  return (
    <Modal
      size="sm"
      isOpen={isOpenModal}
      toggle={() => setIsOpenModal(!isOpenModal)}
    >
      <ModalHeader toggle={() => setIsOpenModal(!isOpenModal)}>
        Edit profile
      </ModalHeader>

      <Form>
        <ModalBody>
          <div style={{ maxWidth: 200 }} className="mx-auto">
            <img
              width="200"
              src={currentUser.avatar_url}
              alt="profil utilisateur"
              className="my-2"
            />
            <input
              ref={ref => {
                uploadInput = ref;
              }}
              onChange={e => uploadAvatar(e)}
              accept="image/*"
              type="file"
              name="profile"
              id="file"
            />
            <ButtonUpload htmlFor="file">
              <i className="fas fa-upload mr-2" />
              <span style={{ fontSize: 13 }}>upload an image</span>
            </ButtonUpload>
          </div>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              ref={ref => {
                username = ref;
              }}
              type="text"
              name="username"
              id="username"
              placeholder={currentUser.username}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            type="submit"
            onClick={() => setIsOpenModal(!isOpenModal)}
          >
            Submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

Profile.propTypes = {
  setIsOpenModal: PropTypes.func.isRequired,
  isOpenModal: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
    avatar_url: PropTypes.string,
  }).isRequired,
};

export default Profile;