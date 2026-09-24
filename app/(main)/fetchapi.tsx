export default async function Page() {
    const Data = await fetch('https://api.vercal.app/blog');
    const post = await Data.json();
    return (
        <ul>
            {post.map((item: any) => (
                <li key={item.id}>
                    <h2>{item.title}</h2>
                </li>
            ))}
        </ul>
    )
}