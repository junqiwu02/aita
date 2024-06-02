export default function Video({ id }: { id: string}) {
  return (
    <audio src={`/audios/${id}.mp3`} controls>
    </audio>
  );
}