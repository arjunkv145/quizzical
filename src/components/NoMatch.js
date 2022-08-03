export default function NoMatch({ useLocation }) {
    let location = useLocation()
  
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    )
}