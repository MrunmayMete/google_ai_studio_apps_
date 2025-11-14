import { Video } from './types';

// ==========================================================================================
// IMPORTANT: VIDEO SOURCE HANDLING
// The application now uses a file input element to allow you to upload a local video.
// The data below serves as a template for video metadata like description and initial likes,
// but the video file itself ('src') is loaded dynamically by the user.
// ==========================================================================================
export const VIDEO_DATA: Video = {
  id: 'local-video-1',
  src: '', // This is a placeholder and will be replaced by the URL of the uploaded video file.
  title: 'Your Local Video Title',
  channel: 'Local Media',
  views: '14850',
  published: 'Just now',
  description: `This is a placeholder description for your local video.
You can edit the video details by modifying the 'VIDEO_DATA' object in the 'src/constants.ts' file.`,
  thumbnail: '', // Thumbnail is not used for a local video player
  likes: 482,
};
