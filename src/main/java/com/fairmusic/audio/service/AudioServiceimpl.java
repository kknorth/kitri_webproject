package com.fairmusic.audio.service;

import com.fairmusic.audio.dao.AudioDAOimpl;
import com.fairmusic.audio.dao.AudioDAO;
import com.fairmusic.dto.audioDTO;

public class AudioServiceimpl implements AudioService{

	@Override
	public int createAudio(audioDTO audio) {
		AudioDAO dao = new AudioDAOimpl();
		int result = dao.createAudio(audio);
		return result;
	}

}
