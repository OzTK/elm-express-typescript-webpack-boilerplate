module Layout exposing (view)

import Html exposing (Html, text, body, h1, h3, div, ul, li, a, node, header)
import Html.Attributes exposing (rel, href, src, name, charset, httpEquiv, content)
import Html.CssHelpers exposing (withNamespace)
import Server exposing (Assets)
import MainStyle


{ id, class } =
    withNamespace ""



-- View


view :
    List (Html.Html msg)
    -> List (Html.Html msg)
    -> Maybe Assets
    -> Html.Html msg
    -> Html.Html msg
view head bottom assets content =
    node "html"
        []
        [ node "head" [] <|
            ([ node "meta" [ charset "utf-8" ] []
             , node "meta" [ httpEquiv "X-UA-Compatible", Html.Attributes.content "dzn" ] []
             , node "meta" [ name "viewport", Html.Attributes.content "width=device-width, initial-scale=1" ] []
             , node "title" [] [ text "OMG it works!!!" ]
             ]
            )
                ++ head
        , body [ id MainStyle.Page ]
            ((assets
                |> Maybe.andThen (\a -> a.manifest.js)
                |> andThen (body_ content)
             )
                ++ bottom
            )
        ]


body_ : Html msg -> List (Html msg)
body_ content =
    [ header []
        [ h3 [] [ text "elm-express-boilerplate" ]
        , ul [ class [ MainStyle.NavBar ] ]
            [ li [] [ a [ href "/" ] [ text "Home" ] ]
            , li [] [ a [ href "/users" ] [ text "Users" ] ]
            ]
        ]
    , div [ class [ MainStyle.Card ] ] [ content ]
    ]


andThen : List (Html msg) -> Maybe String -> List (Html msg)
andThen l asset =
    case ( asset, Maybe.map (String.endsWith ".js") asset ) of
        ( Just js, Just True ) ->
            l ++ [ node "script" [ src js ] [] ]

        ( Just css, Just False ) ->
            l ++ [ node "link" [ rel "stylesheet", href css ] [] ]

        ( _, _ ) ->
            l
