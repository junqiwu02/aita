import Video from "../../components/video";

export default function Vid({ params }: { params: { id: string } }) {
  return (
    <>
      <Video id={params.id} />
    </>
  );
}
